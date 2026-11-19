// The spec can live in its own folder (specRoot), and a project can ship its
// own spec as data (specModule).
import { expect, test } from "bun:test";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runCheck } from "../src/check.ts";
import { compileHash } from "../src/hash.ts";
import { modulePath } from "../src/project.ts";
import { writeGlue } from "../src/compile.ts";
import { load, tempProject } from "./helpers.ts";

function moveSpecInto(dir: string, folder: string) {
  mkdirSync(join(dir, folder));
  for (const f of ["root.ail.md", "a", "b", "lib"]) renameSync(join(dir, f), join(dir, folder, f));
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ specRoot: folder }));
}

test("moving the spec into its own folder changes no output path and no compile hash", () => {
  const dir = tempProject("areas");
  const before = load(dir);
  const hashes = [...before.nodes.values()].map((n) => [n.name, modulePath(before, n), compileHash(before, n)]);
  moveSpecInto(dir, "ail");
  const after = load(dir);
  expect(after.nodes.get("AreaA")!.file).toBe("ail/a/a.ail.md");
  expect(after.nodes.get("AreaA")!.dir).toBe("a");
  expect([...after.nodes.values()].map((n) => [n.name, modulePath(after, n), compileHash(after, n)])).toEqual(hashes);
});

test("files outside the spec root are not part of the spec", () => {
  const dir = tempProject("areas");
  moveSpecInto(dir, "ail");
  writeFileSync(join(dir, "notes.ail.md"), "```ail\nnode Stray : fn   level: system\n```\n");
  expect(load(dir).nodes.has("Stray")).toBe(false);
});

test("the spec module carries every spec file of each listed project, and check notices when it is stale", () => {
  const dir = tempProject("areas");
  moveSpecInto(dir, "ail");
  mkdirSync(join(dir, "other"));
  writeFileSync(join(dir, "other/x.ail.md"), "```ail\nnode X : fn   level: system\n```\n");
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({
    specRoot: "ail",
    specModule: { path: "src/gen/spec.ts", projects: [{ key: "shop", name: "Shop", dir: "ail" }, { key: "other", name: "Other", dir: "other" }] },
  }));
  expect(runCheck(load(dir)).glue).toEqual(["src/gen/spec.ts"]);
  writeGlue(load(dir));
  const mod = readFileSync(join(dir, "src/gen/spec.ts"), "utf8");
  expect(mod).toContain('"key": "shop"');
  expect(mod).toContain('"path": "a/a.ail.md"');
  expect(mod).toContain('"nodeCount": 5');
  expect(mod).toContain('"key": "other"');
  expect(runCheck(load(dir)).glue).toEqual([]);
  // editing any listed project's spec makes the module stale until the next build
  writeFileSync(join(dir, "other/x.ail.md"), "```ail\nnode X : fn   level: system\nnode Y : fn   level: system\n```\n");
  expect(runCheck(load(dir)).glue).toEqual(["src/gen/spec.ts"]);
});

test("the spec module's location is part of every compile hash, but only when configured", () => {
  const dir = tempProject("areas");
  const plain = compileHash(load(dir), load(dir).nodes.get("Price")!);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ specModule: "src/gen/spec.ts" }));
  const withModule = compileHash(load(dir), load(dir).nodes.get("Price")!);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ specModule: "src/gen/data.ts" }));
  expect(new Set([plain, withModule, compileHash(load(dir), load(dir).nodes.get("Price")!)]).size).toBe(3);
});

test("a review across a spec move only shows what really changed", async () => {
  const { renderReview } = await import("../src/lens.ts");
  const dir = tempProject("areas");
  const git = (...a: string[]) => Bun.spawnSync(["git", "-c", "user.email=t@t", "-c", "user.name=t", ...a], { cwd: dir });
  git("init", "-q"); git("add", "-A"); git("commit", "-qm", "base");
  moveSpecInto(dir, "ail");
  const f = join(dir, "ail/lib/lib.ail.md");
  writeFileSync(f, readFileSync(f, "utf8").replace("price(1999) => 19", "price(1999) => 19\n      price(0) => 0"));
  const r = renderReview(load(dir), "HEAD");
  expect(r).toContain("✎ Price");
  expect(r).not.toContain("＋");
});

test("spec files are listed in explorer order: a folder's own files before its subfolders", async () => {
  const { explorerOrder } = await import("../src/compile.ts");
  const paths = ["home/journey/stops/1.ail.md", "site.ail.md", "home/home.ail.md", "parts/a.ail.md", "home/hero/hero.ail.md", "home/journey/journey.ail.md"];
  expect([...paths].sort(explorerOrder)).toEqual([
    "site.ail.md", "home/home.ail.md", "home/hero/hero.ail.md", "home/journey/journey.ail.md", "home/journey/stops/1.ail.md", "parts/a.ail.md",
  ]);
});
