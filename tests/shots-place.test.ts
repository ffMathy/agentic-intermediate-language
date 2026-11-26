// Where proof screenshots live: in the shots/ of the node's own folder (a spec file holds one node, and a folder one
// spec file), end-to-end ones in shots/e2e/. There is no other place, and no setting for one.
import { expect, test } from "bun:test";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { preHook } from "../src/hooks.ts";
import { lint } from "../src/lint.ts";
import { clearShots, e2eShotsDir, isShotFile, legacyShotsDir, nodeShotsDir, relocateShots, shotFolders } from "../src/shots.ts";
import { projectShots, specModule } from "../src/compile.ts";
import { KATA, load, tempProject } from "./helpers.ts";

const shotsIn = (dir: string, node: string, files: string[]) => {
  mkdirSync(dir, { recursive: true });
  for (const f of files) writeFileSync(join(dir, f), "png");
  writeFileSync(join(dir, "shots.json"), JSON.stringify({ node, shots: files.map((f) => ({ test: f.replace(".png", ""), file: f })) }));
};

test("a node keeps its screenshots in its own folder's shots/, its end-to-end ones in shots/e2e/", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  // lib/lib.ail.md holds Lib, lib/price/price.ail.md holds Price.
  expect(nodeShotsDir(p, p.nodes.get("Lib")!)).toBe(join(dir, "lib", "shots"));
  expect(nodeShotsDir(p, p.nodes.get("Price")!)).toBe(join(dir, "lib", "price", "shots"));
  expect(e2eShotsDir(p, p.nodes.get("Lib")!)).toBe(join(dir, "lib", "shots", "e2e"));
  expect(e2eShotsDir(p, p.nodes.get("Price")!)).toBe(join(dir, "lib", "price", "shots", "e2e"));
  // The kata: BoardView is in ail/board/board-view/board-view.ail.md, PlayAGame in ail/app/play/play.ail.md.
  const kata = load(KATA);
  expect(nodeShotsDir(kata, kata.nodes.get("BoardView")!)).toBe(join(KATA, "ail", "board", "board-view", "shots"));
  expect(e2eShotsDir(kata, kata.nodes.get("PlayAGame")!)).toBe(join(KATA, "ail", "app", "play", "shots", "e2e"));
  expect(existsSync(join(nodeShotsDir(kata, kata.nodes.get("BoardView")!), "shots.json"))).toBe(true);
  expect(existsSync(join(KATA, "checks", "shots"))).toBe(false);
});

test("a spec file holds one node", () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "lib", "lib.ail.md"), "```ail\nnode Lib : library   level: system\n  why   Shared.   <- Shop\n  children  Price, Tax\n```\n\n```ail\nnode Tax : fn   level: system\n  why   Tax.   <- Lib\n```\n");
  const d = lint(load(dir)).filter((x) => x.code === "one-node-per-file");
  expect(d.map((x) => [x.node, x.file])).toEqual([["Tax", "lib/lib.ail.md"]]);
  expect(d[0]!.message).toContain("lib/tax.ail.md");
});

test("a folder holds one spec file", () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "lib", "tax.ail.md"), "```ail\nnode Tax : fn   level: system\n  why   Tax.   <- Lib\n```\n");
  writeFileSync(join(dir, "lib", "lib.ail.md"), readFileSync(join(dir, "lib", "lib.ail.md"), "utf8").replace("children  Price", "children  Price, Tax"));
  const d = lint(load(dir)).filter((x) => x.code === "one-file-per-folder");
  expect(d.map((x) => [x.node, x.file])).toEqual([["Tax", "lib/tax.ail.md"]]);
  expect(d[0]!.message).toContain("lib/tax/tax.ail.md");
});

test("screenshots kept in checks/shots/ move to their place, and those of nodes that are gone are dropped", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  const old = legacyShotsDir(p);
  shotsIn(join(old, "lib", "price", "price"), "Price", ["01-a.png"]);
  shotsIn(join(old, "e2e", "lib", "price", "price"), "Price", ["b.png"]);
  shotsIn(join(old, "gone", "gone"), "Gone", ["c.png"]);
  expect(relocateShots(p)).toBe(true);
  expect(existsSync(old)).toBe(false);
  expect(readdirSync(nodeShotsDir(p, price)).sort()).toEqual(["01-a.png", "e2e", "shots.json"]);
  expect(readdirSync(e2eShotsDir(p, price)).sort()).toEqual(["b.png", "shots.json"]);
  expect(shotFolders(p)).toEqual([nodeShotsDir(p, price), e2eShotsDir(p, price)]);
  expect(relocateShots(p)).toBe(false);
});

test("screenshots in older layouts beside the spec move to their node's folder", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const lib = p.nodes.get("Lib")!, price = p.nodes.get("Price")!;
  // lib/shots/lib/ (the node name repeated) and its e2e/ belong in lib/shots/ and lib/shots/e2e/;
  // lib/shots/price/ (from when Price shared lib/'s folder) belongs in lib/price/shots/.
  shotsIn(join(dir, "lib", "shots", "lib"), "Lib", ["01-a.png"]);
  shotsIn(join(dir, "lib", "shots", "lib", "e2e"), "Lib", ["b.png"]);
  shotsIn(join(dir, "lib", "shots", "price"), "Price", ["01-c.png"]);
  expect(relocateShots(p)).toBe(true);
  expect(readdirSync(nodeShotsDir(p, lib)).sort()).toEqual(["01-a.png", "e2e", "shots.json"]);
  expect(readdirSync(e2eShotsDir(p, lib)).sort()).toEqual(["b.png", "shots.json"]);
  expect(readdirSync(nodeShotsDir(p, price)).sort()).toEqual(["01-c.png", "shots.json"]);
  expect(existsSync(join(dir, "lib", "shots", "lib"))).toBe(false);
  expect(existsSync(join(dir, "lib", "shots", "price"))).toBe(false);
  expect(relocateShots(p)).toBe(false);
});

test("screenshots already in their place are not replaced by old ones from checks/shots/", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  shotsIn(nodeShotsDir(p, price), "Price", ["01-new.png"]);
  shotsIn(join(legacyShotsDir(p), "lib", "price", "price"), "Price", ["01-old.png"]);
  expect(relocateShots(p)).toBe(true);
  expect(readdirSync(nodeShotsDir(p, price)).sort()).toEqual(["01-new.png", "shots.json"]);
  expect(existsSync(legacyShotsDir(p))).toBe(false);
});

test("clearing a node's screenshots keeps its end-to-end ones, and removes shots/ once empty", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const lib = p.nodes.get("Lib")!, price = p.nodes.get("Price")!;
  shotsIn(nodeShotsDir(p, lib), "Lib", ["01-a.png"]);
  shotsIn(e2eShotsDir(p, lib), "Lib", ["b.png"]);
  shotsIn(nodeShotsDir(p, price), "Price", ["01-c.png"]);
  clearShots(nodeShotsDir(p, lib));
  expect(readdirSync(nodeShotsDir(p, lib)).sort()).toEqual(["e2e"]);
  clearShots(e2eShotsDir(p, lib));
  clearShots(nodeShotsDir(p, price));
  expect(existsSync(join(dir, "lib", "shots"))).toBe(false);
  expect(existsSync(join(dir, "lib", "price", "shots"))).toBe(false);
  expect(existsSync(join(dir, "lib", "price", "price.ail.md"))).toBe(true);
});

test("the site's spec module finds a project's screenshots beside its spec, end-to-end ones last", () => {
  const shots = projectShots(join(KATA, "ail"));
  expect(shots.length).toBeGreaterThan(0);
  expect(shots.every((s) => s.file.startsWith(join(KATA, "ail")) && s.file.includes("/shots/"))).toBe(true);
  const firstE2e = shots.findIndex((s) => s.file.includes("/e2e/"));
  expect(firstE2e).toBeGreaterThan(0);
  expect(shots.slice(firstE2e).every((s) => s.file.includes("/e2e/"))).toBe(true);
});

test("the spec module gives each screenshot its path, beside its spec, so a page can show them in the spec's own tree", () => {
  const site = load(join(KATA, "..", "..", "site"));
  const mod = specModule(site);
  expect(mod).toContain("export type SpecShot = { node: string; test: string; path: string; src: string };");
  expect(mod).toContain(`"path": "board/board-view/shots/01-picking-an-empty-square.png"`);
  expect(mod).toContain(`"path": "home/review/sample-pull-request/shots/01-the-parts-to-review-are-open.png"`);
});

test("screenshots are written by ail build only: the hook refuses edits to them", () => {
  const p = load(KATA);
  expect(isShotFile(p, "ail/board/board-view/shots/01-picking-an-empty-square.png")).toBe(true);
  expect(isShotFile(p, "ail/board/board-view/shots/shots.json")).toBe(true);
  expect(isShotFile(p, "ail/board/board-view/board-view.ail.md")).toBe(false);
  expect(isShotFile(p, "src/gen/shots/x.png")).toBe(false);
  expect(preHook({ tool_input: { file_path: "ail/board/board-view/shots/shots.json" } }, KATA).code).toBe(2);
  expect(preHook({ tool_input: { file_path: "ail/board/board-view/board-view.ail.md" } }, KATA).code).toBe(0);
});

test("no spec folder may be called shots", () => {
  const dir = tempProject("areas");
  mkdirSync(join(dir, "a", "shots"), { recursive: true });
  writeFileSync(join(dir, "a", "shots", "shots.ail.md"), "```ail\nnode Snap : fn   level: system\n  why   A snap.   <- AreaA\n```\n");
  const d = lint(load(dir));
  expect(d.filter((x) => x.code === "reserved-folder").map((x) => x.file)).toEqual(["a/shots/shots.ail.md"]);
});
