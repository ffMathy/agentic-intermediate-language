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

test("the spec module carries every spec file and node, and check notices when it is stale", () => {
  const dir = tempProject("areas");
  moveSpecInto(dir, "ail");
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ specRoot: "ail", specModule: "src/gen/spec.ts" }));
  expect(runCheck(load(dir)).glue).toEqual(["src/gen/spec.ts"]);
  writeGlue(load(dir));
  const mod = readFileSync(join(dir, "src/gen/spec.ts"), "utf8");
  expect(mod).toContain('"path": "a/a.ail.md"');
  expect(mod).toContain('"name": "Price"');
  expect(runCheck(load(dir)).glue).toEqual([]);
  // editing the spec makes the module stale until the next build
  const f = join(dir, "ail/a/a.ail.md");
  writeFileSync(f, readFileSync(f, "utf8").replace("The basket.", "The shopping basket."));
  expect(runCheck(load(dir)).glue).toEqual(["src/gen/spec.ts"]);
});
