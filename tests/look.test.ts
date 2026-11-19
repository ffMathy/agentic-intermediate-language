// The look check, and `ail build` as the one command: compile, then check.
import { expect, test } from "bun:test";
import { main } from "../src/cli.ts";
import { lookTask, parseVerdict } from "../src/look.ts";
import { loadProject } from "../src/project.ts";
import { modelUnavailable } from "../src/providers/index.ts";
import { KATA, tempProject } from "./helpers.ts";

test("the judge's verdict: MATCHES, or MISMATCH with one problem per line", () => {
  expect(parseVerdict("MATCHES")).toEqual({ ok: true, problems: [] });
  expect(parseVerdict("MISMATCH\n- a win: the squares are green — the spec says: color.highlight\n- draw: x")).toEqual({
    ok: false, problems: ["a win: the squares are green — the spec says: color.highlight", "draw: x"],
  });
  // anything else is not taken as a pass
  expect(parseVerdict("Looks fine to me!").ok).toBe(false);
  expect(parseVerdict("MISMATCH").ok).toBe(false);
});

test("the judge sees the node, the token values and the screens' names", () => {
  const p = loadProject(KATA);
  const n = p.nodes.get("BoardView")!;
  const task = lookTask(p, n, [{ node: "BoardView", test: "the winning line stands out", file: "x.png" }]);
  expect(task).toContain("winning line  its three squares get background color.highlight instead");
  expect(task).toMatch(/color\.highlight=#[0-9a-f]{6}/);
  expect(task).toContain('"the winning line stands out"');
});

test("whether a model can be reached here", () => {
  const none = () => null;
  expect(modelUnavailable("claude-code", {}, none)).toContain("not installed");
  expect(modelUnavailable("claude-code", {}, () => "/bin/claude")).toBeNull();
  expect(modelUnavailable("anthropic:claude-opus-5-5", {}, none)).toContain("ANTHROPIC_API_KEY");
  expect(modelUnavailable("anthropic:claude-opus-5-5", { ANTHROPIC_API_KEY: "k" }, none)).toBeNull();
  expect(modelUnavailable("mock:x.json", {}, none)).toBeNull();
});

test("without a model, ail build reports what is out of date instead of calling one", async () => {
  const dir = tempProject("mini");
  const saved = { key: process.env.OPENAI_API_KEY, base: process.env.OPENAI_BASE_URL };
  delete process.env.OPENAI_API_KEY; delete process.env.OPENAI_BASE_URL;
  const log = console.log, err = console.error;
  let out = "";
  console.log = (s: string) => { out += s + "\n"; };
  console.error = (s: string) => { out += s + "\n"; };
  try {
    expect(await main(["build", "--root", dir, "--model", "openai:some-model"])).toBe(1);
  } finally {
    console.log = log; console.error = err;
    if (saved.key) process.env.OPENAI_API_KEY = saved.key;
    if (saved.base) process.env.OPENAI_BASE_URL = saved.base;
  }
  expect(out).toContain("need building, but there is no model here: OPENAI_API_KEY is not set");
  expect(out).toContain("✗ build");
});
