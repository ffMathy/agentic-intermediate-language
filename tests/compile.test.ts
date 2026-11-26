import { expect, test } from "bun:test";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { compile, parseReply, submit } from "../src/compile.ts";
import { plan } from "../src/plan.ts";
import { getProvider } from "../src/providers/index.ts";
import { verifyNode } from "../src/verify.ts";
import { load, mockFile, reply, tempProject } from "./helpers.ts";

const ADD = "src/gen/add.ts";
const PICK = "src/gen/pick.ts";
const goodAdd = `/** add(a, b) */\nexport function add(a: number, b: number): number {\n  return a + b;\n}`;
const badAdd = `export function add(a: number, b: number): number {\n  return a - b;\n}`;
const goodPick = `/** pick(xs) */\nexport function pick(xs: number[]): number {\n  return xs.indexOf(Math.max(...xs));\n}`;

test("parseReply reads file blocks, strips fences and recognises STOP", () => {
  expect(parseReply(reply("a.ts", "```ts\nx\n```")).files).toEqual({ "a.ts": "x\n" });
  expect(parseReply("STOP: which index wins a tie?").stop).toBe("which index wins a tie?");
});

test("compile: a rejected attempt is retried with the failures, then locked", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: [reply(ADD, badAdd), reply(ADD, goodAdd)], Pick: [reply(PICK, goodPick)] })}`);
  const out = await compile(load(dir), [], { provider });
  expect(out.map((o) => [o.node, o.status, o.attempts])).toEqual([["Add", "compiled", 2], ["Pick", "compiled", 1]]);
  expect(plan(load(dir)).every((e) => e.status === "fresh")).toBe(true);
  const lock = JSON.parse(readFileSync(join(dir, "ail.lock.json"), "utf8"));
  expect(Object.keys(lock.nodes)).toEqual(["Add", "Pick"]);

  // cache hit: nothing is asked of the model the second time
  const again = await compile(load(dir), [], { provider: getProvider(`mock:${mockFile(dir, {})}`) });
  expect(again.every((o) => o.status === "fresh")).toBe(true);
});

test("compile: STOP surfaces a spec question instead of guessing", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: ["STOP: should add overflow to Infinity or throw?"] })}`);
  const [o] = await compile(load(dir), ["Add"], { provider });
  expect(o).toMatchObject({ status: "stopped", detail: "should add overflow to Infinity or throw?" });
  expect(existsSync(join(dir, ADD))).toBe(false);
});

test("compile: gives up after max attempts and leaves nothing behind", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: [reply(ADD, badAdd)] })}`);
  const [o] = await compile(load(dir), ["Add"], { provider, maxAttempts: 2 });
  expect(o!.status).toBe("failed");
  expect(existsSync(join(dir, ADD))).toBe(false);
});

test("submit: a node may only write its own file", () => {
  const dir = tempProject();
  const p = load(dir);
  const r = submit(p, p.nodes.get("Add")!, { [ADD]: goodAdd, "src/gen/evil.ts": "x" });
  expect(r.ok).toBe(false);
  expect(r.error).toContain("may only write src/gen/add.ts");
});

test("submit: importing outside `uses` is rejected (encapsulation)", () => {
  const dir = tempProject();
  let p = load(dir);
  expect(submit(p, p.nodes.get("Add")!, { [ADD]: goodAdd }).ok).toBe(true);
  expect(submit(load(dir), load(dir).nodes.get("Pick")!, { [PICK]: goodPick }).ok).toBe(true);
  p = load(dir);
  const r = submit(p, p.nodes.get("Add")!, { [ADD]: `import { pick } from "./pick";\n${goodAdd}` });
  expect(r.ok).toBe(false);
  expect(r.verify!.checks.find((c) => c.kind === "imports")!.detail).toContain("./pick");
});

test("hand edits to generated code are detected as drift", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: [reply(ADD, goodAdd)] })}`);
  await compile(load(dir), ["Add"], { provider });
  writeFileSync(join(dir, ADD), goodAdd + "\n// tweak\n");
  const p = load(dir);
  expect(plan(p).find((e) => e.node === "Add")!.status).toBe("drifted");
  expect(verifyNode(p, p.nodes.get("Add")!).ok).toBe(false);
});

test("spec edits make exactly the affected nodes stale", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: [reply(ADD, goodAdd)], Pick: [reply(PICK, goodPick)] })}`);
  await compile(load(dir), [], { provider });
  const f = join(dir, "pick.ail.md");
  writeFileSync(f, readFileSync(f, "utf8").replace("pick([1, 5, 2]) => 1", "pick([1, 5, 2]) => 1\n      pick([7]) => 0"));
  expect(plan(load(dir)).map((e) => [e.node, e.status])).toEqual([["Add", "fresh"], ["Pick", "stale"]]);
});

test("without an API key, the default model is Claude Code's own login", async () => {
  const { defaultModel } = await import("../src/providers/index.ts");
  expect(defaultModel({ ANTHROPIC_API_KEY: "x" }, () => "/bin/claude")).toBe("anthropic:claude-opus-5-5");
  expect(defaultModel({}, () => "/bin/claude")).toBe("claude-code");
  expect(defaultModel({}, () => null)).toBe("anthropic:claude-opus-5-5");
  expect(getProvider("claude-code:opus").id).toBe("claude-code:opus");
});

test("a node whose dependency did not build is skipped, not attempted", async () => {
  const dir = tempProject();
  const provider = getProvider(`mock:${mockFile(dir, { Add: ["STOP: overflow?"], Pick: [reply(PICK, goodPick)] })}`);
  const out = await compile(load(dir), [], { provider });
  expect(out.map((o) => [o.node, o.status])).toEqual([["Add", "stopped"], ["Pick", "skipped"]]);
  expect(out[1]!.detail).toBe("waiting for Add");
});
