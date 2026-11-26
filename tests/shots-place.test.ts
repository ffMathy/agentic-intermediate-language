// Where proof screenshots live: beside the spec, in each spec folder's shots/<node>/
// (end-to-end ones in its e2e/). There is no other place, and no setting for one.
import { expect, test } from "bun:test";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { preHook } from "../src/hooks.ts";
import { lint } from "../src/lint.ts";
import { clearShots, e2eShotsDir, isShotFile, legacyShotsDir, moveLegacyShots, nodeShotsDir, shotFolders } from "../src/shots.ts";
import { projectShots } from "../src/compile.ts";
import { KATA, load, tempProject } from "./helpers.ts";

const shotsIn = (dir: string, node: string, files: string[]) => {
  mkdirSync(dir, { recursive: true });
  for (const f of files) writeFileSync(join(dir, f), "png");
  writeFileSync(join(dir, "shots.json"), JSON.stringify({ node, shots: files.map((f) => ({ test: f.replace(".png", ""), file: f })) }));
};

test("a node's screenshots sit beside its spec file, its end-to-end ones in their e2e/", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  expect(nodeShotsDir(p, price)).toBe(join(dir, price.dir, "shots", "price"));
  expect(e2eShotsDir(p, price)).toBe(join(dir, price.dir, "shots", "price", "e2e"));
  // The kata: BoardView is in ail/board/board.ail.md.
  const kata = load(KATA);
  expect(nodeShotsDir(kata, kata.nodes.get("BoardView")!)).toBe(join(KATA, "ail", "board", "shots", "board-view"));
  expect(existsSync(join(nodeShotsDir(kata, kata.nodes.get("BoardView")!), "shots.json"))).toBe(true);
  expect(existsSync(join(KATA, "checks", "shots"))).toBe(false);
});

test("screenshots kept in checks/shots/ are moved beside the spec, and those of nodes that are gone are dropped", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  const old = legacyShotsDir(p);
  shotsIn(join(old, price.dir, "price"), "Price", ["01-a.png"]);
  shotsIn(join(old, "e2e", price.dir, "price"), "Price", ["b.png"]);
  shotsIn(join(old, "gone", "gone"), "Gone", ["c.png"]);
  expect(moveLegacyShots(p)).toBe(true);
  expect(existsSync(old)).toBe(false);
  expect(readdirSync(nodeShotsDir(p, price)).sort()).toEqual(["01-a.png", "e2e", "shots.json"]);
  expect(readdirSync(e2eShotsDir(p, price)).sort()).toEqual(["b.png", "shots.json"]);
  expect(shotFolders(p)).toEqual([nodeShotsDir(p, price), e2eShotsDir(p, price)]);
  expect(moveLegacyShots(p)).toBe(false);
});

test("screenshots already retaken beside the spec are not replaced by old ones from checks/shots/", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  shotsIn(nodeShotsDir(p, price), "Price", ["01-new.png"]);
  shotsIn(join(legacyShotsDir(p), price.dir, "price"), "Price", ["01-old.png"]);
  expect(moveLegacyShots(p)).toBe(true);
  expect(readdirSync(nodeShotsDir(p, price)).sort()).toEqual(["01-new.png", "shots.json"]);
  expect(existsSync(legacyShotsDir(p))).toBe(false);
});

test("clearing a node's screenshots keeps its end-to-end ones, and removes the shots/ folder once empty", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const price = p.nodes.get("Price")!;
  shotsIn(nodeShotsDir(p, price), "Price", ["01-a.png"]);
  shotsIn(e2eShotsDir(p, price), "Price", ["b.png"]);
  clearShots(nodeShotsDir(p, price));
  expect(readdirSync(nodeShotsDir(p, price))).toEqual(["e2e"]);
  clearShots(e2eShotsDir(p, price));
  expect(existsSync(join(dir, price.dir, "shots"))).toBe(false);
  expect(existsSync(join(dir, price.dir))).toBe(true);
});

test("the site's spec module finds a project's screenshots beside its spec, end-to-end ones last", () => {
  const shots = projectShots(join(KATA, "ail"));
  expect(shots.length).toBeGreaterThan(0);
  expect(shots.every((s) => s.file.startsWith(join(KATA, "ail")) && s.file.includes("/shots/"))).toBe(true);
  const firstE2e = shots.findIndex((s) => s.file.includes("/e2e/"));
  expect(firstE2e).toBeGreaterThan(0);
  expect(shots.slice(firstE2e).every((s) => s.file.includes("/e2e/"))).toBe(true);
});

test("screenshots are written by ail build only: the hook refuses edits to them", () => {
  const p = load(KATA);
  expect(isShotFile(p, "ail/board/shots/board-view/01-picking-an-empty-square.png")).toBe(true);
  expect(isShotFile(p, "ail/board/shots/board-view/shots.json")).toBe(true);
  expect(isShotFile(p, "ail/board/board.ail.md")).toBe(false);
  expect(isShotFile(p, "src/gen/shots/x.png")).toBe(false);
  expect(preHook({ tool_input: { file_path: "ail/board/shots/board-view/shots.json" } }, KATA).code).toBe(2);
  expect(preHook({ tool_input: { file_path: "ail/board/board.ail.md" } }, KATA).code).toBe(0);
});

test("no spec folder may be called shots", () => {
  const dir = tempProject("areas");
  mkdirSync(join(dir, "a", "shots"), { recursive: true });
  writeFileSync(join(dir, "a", "shots", "shots.ail.md"), "```ail\nnode Snap : fn   level: system\n  why   A snap.   <- AreaA\n```\n");
  const d = lint(load(dir)).filter((x) => x.code === "reserved-folder");
  expect(d.length).toBe(1);
  expect(d[0]!.file).toBe("a/shots/shots.ail.md");
});
