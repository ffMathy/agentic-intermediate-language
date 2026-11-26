import { expect, test } from "bun:test";
import { submit } from "../src/compile.ts";
import { diverge } from "../src/diverge.ts";
import { getProvider } from "../src/providers/index.ts";
import { load, mockFile, reply, tempProject } from "./helpers.ts";

const PICK = "src/gen/pick/pick.ts";
const first = `export function pick(xs: number[]): number {\n  return xs.indexOf(Math.max(...xs));\n}`;
/** Pick uses Add, so Add's module must exist before Pick can be verified. */
function withAdd(): string {
  const dir = tempProject();
  const p = load(dir);
  if (!submit(p, p.nodes.get("Add")!, { "src/gen/add/add.ts": "export function add(a: number, b: number): number {\n  return a + b;\n}\n" }).ok) throw new Error("setup");
  return dir;
}
const last = `export function pick(xs: number[]): number {\n  return xs.lastIndexOf(Math.max(...xs));\n}`;

test("samples that disagree on a probe are reported as under-specified", async () => {
  const dir = withAdd();
  const a = getProvider(`mock:${mockFile(dir, { Pick: [reply(PICK, first), reply(PICK, first)] })}`);
  const b = getProvider(`mock:${mockFile(dir + "/..", { Pick: [reply(PICK, last)] })}`);
  const r = await diverge(load(dir), load(dir).nodes.get("Pick")!, [a, b], 2);
  expect(r.verdict).toBe("divergent");
  expect(r.samples.every((s) => s.verified)).toBe(true);
  const finding = r.findings.find((f) => f.includes("pick([3, 3])"))!;
  expect(finding).toContain("0  ← 2/4");
  expect(finding).toContain("1  ← 2/4");
});

test("samples that agree converge, and STOP answers are findings", async () => {
  const dir = withAdd();
  const ok = getProvider(`mock:${mockFile(dir, { Pick: [reply(PICK, first)] })}`);
  expect((await diverge(load(dir), load(dir).nodes.get("Pick")!, [ok], 3)).verdict).toBe("converged");
  const stop = getProvider(`mock:${mockFile(dir, { Pick: ["STOP: which index wins a tie?"] })}`);
  const r = await diverge(load(dir), load(dir).nodes.get("Pick")!, [stop], 1);
  expect(r.verdict).toBe("divergent");
  expect(r.findings[0]).toContain("which index wins a tie?");
});
