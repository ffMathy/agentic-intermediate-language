import { expect, test } from "bun:test";
import { extractBlocks, parseFile, stripComment } from "../src/parse.ts";

test("only ail fences carry meaning", () => {
  const md = "# Title\n```ts\nnode Nope : fn\n```\n```ail\nnode Yes : fn   level: system\n```\n";
  expect(extractBlocks(md)).toHaveLength(1);
  expect(parseFile("x.ail.md", md).nodes.map((n) => n.name)).toEqual(["Yes"]);
});

test("comments are stripped outside quotes only", () => {
  expect(stripComment('copy  a.b  "x; y"   ; note')).toBe('copy  a.b  "x; y"');
  expect(stripComment("a;b")).toBe("a;b");
});

test("node header, sections and derived fields", () => {
  const md = [
    "```ail",
    "node Thing : fn   level: specialist   @ai @perf",
    "  why   Because.   <- Parent",
    "  what",
    "    f(x) -> number",
    "    Scenario: it works",
    "      Given a",
    "      Then b",
    "    examples",
    "      (g => g(1))(x => x + 1) => 2",
    "    probes",
    "      f(0)",
    "    1. A claim.   refined-by: A, B",
    "  how",
    "    decide use a map",
    "      because it is fast",
    "      rejected a list because it is slow",
    "  free  [ names, order of helpers ]",
    "  uses  A, B",
    "  children  C",
    "```",
  ].join("\n");
  const n = parseFile("t.ail.md", md).nodes[0]!;
  expect(n.kind).toBe("fn");
  expect(n.level).toBe("specialist");
  expect(n.tags).toEqual(["ai", "perf"]);
  expect(n.why).toEqual({ text: "Because.   <- Parent", ref: "Parent" });
  expect(n.scenarios).toEqual([{ title: "it works", steps: ["Given a", "Then b"], line: expect.any(Number) }]);
  expect(n.examples.map((e) => [e.expr, e.expected])).toEqual([["(g => g(1))(x => x + 1)", "2"]]);
  expect(n.probes.map((p) => p.expr)).toEqual(["f(0)"]);
  expect(n.claims.map((c) => c.refs)).toEqual([["A", "B"]]);
  expect(n.decisions[0]).toMatchObject({ what: "use a map", because: "it is fast", rejected: [{ alternative: "a list", because: "it is slow" }] });
  expect(n.free).toEqual(["names", "order of helpers"]);
  expect(n.uses).toEqual(["A", "B"]);
  expect(n.children).toEqual(["C"]);
});

test("glossary, catalog and target statements", () => {
  const md = [
    "```ail",
    "glossary",
    '  term "game over"  plain "it ended"  formal status ≠ playing',
    "catalog",
    "  tokens",
    "    space.1=4px  color.x=#fff",
    "target",
    "  code     TS",
    "  path.fn  src/{kebab}.ts",
    "```",
  ].join("\n");
  const f = parseFile("g.ail.md", md);
  expect(f.errors).toEqual([]);
  expect(f.glossary[0]).toMatchObject({ term: "game over", plain: "it ended", formal: "status ≠ playing" });
  expect(f.catalogs[0]).toMatchObject({ tokens: { "space.1": "4px", "color.x": "#fff" } });
  expect(f.targets[0]!.settings["path.fn"]).toBe("src/{kebab}.ts");
});

test("profiles, jargon and catalog components are gone", () => {
  const f = parseFile("old.ail.md", "```ail\nuse profile web.react.2026\njargon reducer\ncatalog\n  components\n    Button.primary\n```");
  expect(f.errors.map((e) => e.message)).toEqual([
    'unknown statement "use"',
    'unknown statement "jargon"',
    "catalog components are ordinary nodes now: specify them as views (e.g. in a `library` node) and list them under `uses`",
  ]);
});

test("malformed statements are reported, not thrown", () => {
  const f = parseFile("bad.ail.md", "```ail\nfrobnicate x\n  indented\n```");
  expect(f.errors[0]!.message).toContain('unknown statement "frobnicate"');
});
