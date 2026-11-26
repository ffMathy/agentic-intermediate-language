import { expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { main } from "../src/cli.ts";
import { checkPath, submit } from "../src/compile.ts";
import { buildContext } from "../src/context.ts";
import { show } from "../src/show.ts";
import { loadProject } from "../src/project.ts";
import { KATA, load, tempProject } from "./helpers.ts";

const installed = existsSync(join(KATA, "node_modules", "react"));

test("ail build only checks when nothing changed, and passes on the kata", async () => {
  if (!installed) return;
  const log = console.log;
  let out = "";
  console.log = (s: string) => { out += s; };
  try { expect(await main(["build", "--root", KATA, "--no-look"])).toBe(0); } finally { console.log = log; }
  expect(out).toContain("✓ spec");
  expect(out).toContain("✓ build    16 node(s) up to date");
  expect(out).toMatch(/✓ behavior \d+ test\(s\) passed, typecheck ok/);
}, 60_000);

test("ail show covers the tree, a node and changes, and nothing else", () => {
  const p = loadProject(KATA);
  expect(show(p)).toContain("BoardView : view · experience · board/board-view [fresh] (used by 2)");
  expect(show(p, "ComputerPlayer")).toContain("used by:  PlayAGame (app/play/), WatchADemo (app/demo/)");
  expect(() => show(p, "stakeholder")).toThrow('nothing called "stakeholder"');
  expect(() => show(p, "nonsense")).toThrow('nothing called "nonsense"');
});

test("unknown commands fail with help", async () => {
  const err = console.error;
  console.error = () => {};
  try { expect(await main(["compile"])).toBe(1); } finally { console.error = err; }
});

test("the context asks for a derived check when one is missing, and submit accepts it", () => {
  const dir = tempProject();
  const f = join(dir, "pick/pick.ail.md");
  writeFileSync(f, readFileSync(f, "utf8").replace("    probes\n      pick([3, 3])", "    probes\n      pick([3, 3])\n  verify\n    empty input: pick([]) returns -1"));
  let p = load(dir);
  expect(submit(p, p.nodes.get("Add")!, { "src/gen/add/add.ts": "export function add(a: number, b: number): number {\n  return a + b;\n}\n" }).ok).toBe(true);
  p = load(dir);
  const pick = p.nodes.get("Pick")!;
  expect(buildContext(p, pick)).toContain("## Derived check needed");
  const check = `import { expect, test } from "bun:test";\nimport { pick } from "../../src/gen/pick/pick";\ntest("empty input", () => { expect(pick([])).toBe(-1); });\n`;
  const r = submit(p, pick, { "src/gen/pick/pick.ts": "export function pick(xs: number[]): number {\n  return xs.indexOf(Math.max(...xs));\n}\n", [checkPath(p, pick)]: check });
  expect(r.ok).toBe(true);
  expect(readFileSync(join(dir, checkPath(p, pick)), "utf8")).toStartWith("// ail-derived-from: Pick@");
  expect(buildContext(load(dir), load(dir).nodes.get("Pick")!)).not.toContain("## Derived check needed");
});
