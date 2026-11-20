// Regression tests for findings from the adversarial review of the
// profiles → target change.
import { expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compile, prune, validJobs, writeGlue } from "../src/compile.ts";
import { lint } from "../src/lint.ts";
import { getProvider } from "../src/providers/index.ts";
import { load, mockFile, reply, tempProject } from "./helpers.ts";

const codes = (dir: string) => lint(load(dir)).map((d) => d.code);
const edit = (dir: string, file: string, from: string, to: string) => {
  const f = join(dir, file);
  const s = readFileSync(f, "utf8");
  if (!s.includes(from)) throw new Error(`fixture lacks: ${from}`);
  writeFileSync(f, s.replace(from, to));
};
const ADD = "src/gen/add.ts";
const goodAdd = "export function add(a: number, b: number): number {\n  return a + b;\n}";

test("--jobs that isn't a positive integer is treated as 1, never as 'hang' or 'no limit'", () => {
  expect([validJobs(0), validJobs(-3), validJobs(NaN), validJobs(2.5), validJobs(4)]).toEqual([1, 1, 1, 1, 4]);
});

test("a model error fails that node instead of aborting the whole build", async () => {
  const dir = tempProject();
  const provider = { id: "boom", complete: async () => { throw new Error("rate limited"); } };
  const out = await compile(load(dir), [], { provider });
  expect(out.map((o) => [o.node, o.status])).toEqual([["Add", "failed"], ["Pick", "skipped"]]);
  expect(out[0]!.detail).toContain("rate limited");
});

test("without a target, prune deletes nothing", async () => {
  const dir = tempProject();
  await compile(load(dir), ["Add"], { provider: getProvider(`mock:${mockFile(dir, { Add: [reply(ADD, goodAdd)] })}`) });
  edit(dir, "mini.ail.md", "target\n", "notatarget\n");
  expect(prune(load(dir)).removed).toEqual([]);
  expect(existsSync(join(dir, ADD))).toBe(true);
  expect(codes(dir)).toContain("parse");
});

test("old glue outside the generated paths is forgotten, not deleted", () => {
  const dir = tempProject();
  writeFileSync(join(dir, "index.html"), "<p>old generated page</p>\n");
  const hash = new Bun.CryptoHasher("sha256").update("<p>old generated page</p>\n").digest("hex");
  writeFileSync(join(dir, "ail.lock.json"), JSON.stringify({ version: 1, nodes: {}, glue: { "index.html": hash } }));
  writeGlue(load(dir));
  expect(existsSync(join(dir, "index.html"))).toBe(true);
  expect(JSON.parse(readFileSync(join(dir, "ail.lock.json"), "utf8")).glue).toEqual({});
});

test("a project without a target is an error", () => {
  const dir = tempProject();
  edit(dir, "mini.ail.md", "target\n", "glossary\n");
  expect(codes(dir)).toContain("no-target");
});

test("components: layout notation, variants, owners, quotes and file names", () => {
  const dir = tempProject("areas");
  const lib = "lib/lib.ail.md";
  // a Box view with one variant
  edit(dir, lib, "  children  Price", "  children  Price, Box");
  writeFileSync(join(dir, "lib/box.ail.md"), "```ail\nnode Box : view   level: system\n  why   A box.   <- Lib\n  what\n    Scenario: shown\n      Then it is shown\n  look\n    tight  pad space.1\n```\n");
  // AreaA's look uses box(...) notation without listing Box
  edit(dir, "a/a.ail.md", "  uses  Price", "  look\n    layout  box(v) [ total ]\n  uses  Price");
  expect(lint(load(dir)).filter((d) => d.code === "missing-uses").map((d) => d.node)).toEqual(["AreaA"]);
  // with Box listed: an unknown variant is caught, a known one isn't
  edit(dir, "a/a.ail.md", "  uses  Price", "  uses  Price, Box");
  edit(dir, "a/a.ail.md", "layout  box(v) [ total ]", "layout  Box.tight, then Box.huge; built with Node.js; 'Shop' and “Shop” are copy");
  const d = lint(load(dir));
  expect(d.filter((x) => x.code === "unknown-variant").map((x) => x.message)).toEqual(['"Box.huge": Box mentions no "huge" variant in its look, binds or what']);
  expect(d.some((x) => x.code === "unknown-component")).toBe(false);
  // mentioning an owner (Shop is AreaA's parent) never demands a cycle
  edit(dir, "a/a.ail.md", "'Shop' and “Shop” are copy", "sits inside Shop");
  expect(codes(dir)).not.toContain("missing-uses");
});

test("examples run from AIL notation: nothing, is, and where", async () => {
  const { exampleJs } = await import("../src/verify.ts");
  const run = (src: string, scope: Record<string, unknown>) => new Function(...Object.keys(scope), `return (${src});`)(...Object.values(scope));
  const scope = { play: (xs: number[]) => ({ xs }), same: (g: unknown) => g, copy: (g: object) => ({ ...g }) };
  const a = exampleJs("same(g) is g", "true   where g = play([4])");
  expect(run(a.actual, scope)).toBe(run(a.expected, scope));
  const b = exampleJs("copy(g) is not g and copy(g).xs[0] is 4", "true   where g = play([4])");
  expect(run(b.actual, scope)).toBe(true);
  const c = exampleJs("[nothing, \"nothing\"]", "x");
  expect(run(c.actual, scope)).toEqual([null, "nothing"]);
});
