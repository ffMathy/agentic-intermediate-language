// A target in another language: its checks are written in that language
// (`checks.path`) and run with its own tool (`checks.run`). Shell scripts stand
// in for that language here, so the tests need nothing but `sh`.
import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordAdopted } from "../src/adopt.ts";
import { buildContext } from "../src/context.ts";
import { compileHash, specHash } from "../src/hash.ts";
import { prune, submit } from "../src/compile.ts";
import { lint } from "../src/lint.ts";
import { plan } from "../src/plan.ts";
import { isCompilable, modulePath } from "../src/project.ts";
import { checkHeader, checkPath, needsDerivedCheck, verifyNode } from "../src/verify.ts";
import { load } from "./helpers.ts";

const TARGET = `\`\`\`ail
target
  code         POSIX shell
  path.fn      src/{dir}/{name}.sh
  generated    src/**
  tests        shell scripts that exit 0 when every check passes
  checks.path  tests/Gen.Tests/{dir}/{name}Tests.sh
  checks.run   sh {files}
\`\`\``;

const SPEC = `${TARGET}

\`\`\`ail
node Calc : system   level: product
  why   People need to work with numbers.
  what
    1. You can add two numbers.   refined-by: Add
  children  Add, Clock
\`\`\`

\`\`\`ail
node Clock : data   level: system   @existing
  why   The time comes from the platform.   <- Calc
  what
    now() -> time
\`\`\`

\`\`\`ail
node Add : fn   level: system
  why   Addition.   <- Calc
  what
    add(a: number, b: number) -> number
    examples
      add(1, 2) => 3
  uses  Clock
\`\`\`
`;

function project(spec = SPEC): string {
  const dir = mkdtempSync(join(tmpdir(), "ail-foreign-"));
  writeFileSync(join(dir, "ail.config.json"), "{}\n");
  writeFileSync(join(dir, "calc.ail.md"), spec);
  return dir;
}

const MODULE = "src/Add.sh";
const CHECK = "tests/Gen.Tests/AddTests.sh";
const goodAdd = `add() { echo $(($1 + $2)); }\n`;
const badAdd = `add() { echo $(($1 - $2)); }\n`;
const check = `. ./src/Add.sh\n[ "$(add 1 2)" = 3 ] || { echo "example 1: add(1, 2) => 3 failed"; exit 1; }\necho "1 passed"\n`;

test("a foreign target's check goes where checks.path says, with a header in its comment syntax", () => {
  const p = load(project());
  const add = p.nodes.get("Add")!;
  expect(checkPath(p, add)).toBe(CHECK);
  expect(checkHeader(p, add)).toMatch(/^# ail-derived-from: Add@[0-9a-f]{16}$/);
  // Its examples can't be run as bun tests, so they need a derived check too.
  expect(needsDerivedCheck(add, p)).toBe(true);
  expect(needsDerivedCheck(add)).toBe(false);
});

test("submit: a foreign check runs with checks.run, and a failing one rolls the node back", () => {
  const dir = project();
  let p = load(dir);
  const bad = submit(p, p.nodes.get("Add")!, { [MODULE]: badAdd, [CHECK]: check });
  expect(bad.ok).toBe(false);
  expect(bad.verify!.checks.find((c) => c.kind === "tests")!.detail).toContain("example 1: add(1, 2) => 3 failed");
  expect(existsSync(join(dir, MODULE))).toBe(false);
  expect(existsSync(join(dir, CHECK))).toBe(false);

  p = load(dir);
  const good = submit(p, p.nodes.get("Add")!, { [MODULE]: goodAdd, [CHECK]: check });
  expect(good.ok).toBe(true);
  expect(good.verify!.checks.find((c) => c.kind === "tests")!.detail).toBe("1 passed");
  expect(readFileSync(join(dir, CHECK), "utf8")).toStartWith("# ail-derived-from: Add@");
  expect(plan(load(dir)).find((e) => e.node === "Add")!.status).toBe("fresh");
});

test("verify: a foreign node without its check fails, rather than passing with nothing run", () => {
  const dir = project();
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(join(dir, MODULE), goodAdd);
  const r = verifyNode(load(dir), load(dir).nodes.get("Add")!, { checkDrift: false });
  expect(r.ok).toBe(false);
  expect(r.checks.find((c) => c.kind === "derived")).toMatchObject({ ok: false, severity: "error" });
});

test("prune removes the foreign check of a node that is gone", () => {
  const dir = project();
  const p = load(dir);
  expect(submit(p, p.nodes.get("Add")!, { [MODULE]: goodAdd, [CHECK]: check }).ok).toBe(true);
  writeFileSync(join(dir, "calc.ail.md"), SPEC.replace(/```ail\nnode Add[\s\S]*?```\n/, "").replace("Add, Clock", "Clock").replace("refined-by: Add", "refined-by: Clock"));
  expect(prune(load(dir)).removed).toContain(CHECK);
  expect(existsSync(join(dir, CHECK))).toBe(false);
});

test("an @existing node is never compiled, and its dependants see its contract as existing code", () => {
  const p = load(project());
  const clock = p.nodes.get("Clock")!;
  expect(modulePath(p, clock)).toBeNull();
  expect(isCompilable(p, clock)).toBe(false);
  expect(plan(p).map((e) => e.node)).toEqual(["Add"]);
  const ctx = buildContext(p, p.nodes.get("Add")!);
  expect(ctx).toContain("### Clock — existing code, written by hand");
  expect(ctx).toContain("now() -> time");
  // ...and it is not reported as a leaf without a path.
  expect(lint(p).filter((d) => d.node === "Clock").map((d) => d.code)).toEqual([]);
});

test("lint: an @existing node without a contract, an unknown path placeholder, half a checks setting", () => {
  const codes = (spec: string) => lint(load(project(spec))).map((d) => d.code);
  expect(codes(SPEC.replace("  what\n    now() -> time\n", ""))).toContain("existing-without-contract");
  expect(codes(SPEC.replace("src/{dir}/{name}.sh", "src/{dir}/{Pascal}.sh"))).toContain("unknown-placeholder");
  expect(codes(SPEC.replace("  checks.run   sh {files}\n", ""))).toContain("checks-incomplete");
  expect(codes(SPEC)).not.toContain("unknown-placeholder");
});

test("a TypeScript target is unchanged: no checks.path, bun checks under checks/", () => {
  const dir = project(SPEC.replace(/  checks\.path.*\n  checks\.run.*\n/, ""));
  const p = load(dir);
  expect(checkPath(p, p.nodes.get("Add")!)).toBe("checks/add.test.ts");
  expect(needsDerivedCheck(p.nodes.get("Add")!, p)).toBe(false);
  rmSync(dir, { recursive: true });
});

test("by default, changing the target rebuilds an adopted node", () => {
  const dir = project();
  recordAdopted(load(dir));
  writeFileSync(join(dir, "calc.ail.md"), SPEC.replace("code         POSIX shell", "code         C# 14"));
  expect(plan(load(dir)).find((e) => e.node === "Add")!.status).toBe("stale");
});

test("node by node, an adopted node stays adopted when only the target changes, and goes stale when its spec does", () => {
  const dir = project();
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ migrate: "node-by-node" }));
  const lockFile = join(dir, "ail.lock.json");
  const record = () => recordAdopted(load(dir));
  expect(record()).toEqual(["Add"]);
  expect(JSON.parse(readFileSync(lockFile, "utf8")).nodes.Add).toMatchObject({ adopted: true, spec: expect.any(String) });
  const status = () => plan(load(dir)).find((e) => e.node === "Add")!.status;
  expect(status()).toBe("fresh");

  // The conventions of generated code change: code ail didn't generate is unaffected.
  writeFileSync(join(dir, "calc.ail.md"), SPEC.replace("code         POSIX shell", "code         POSIX shell, two-space indents"));
  expect(status()).toBe("fresh");
  expect(record()).toEqual([]);

  // Its own spec changes: ail builds it from now on.
  writeFileSync(join(dir, "calc.ail.md"), SPEC.replace("add(1, 2) => 3", "add(1, 2) => 3\n      add(2, 2) => 4"));
  expect(status()).toBe("stale");
});

test("a lock written before spec hashes were kept gets them filled in, without re-adopting anything", () => {
  const dir = project();
  const p = load(dir);
  const add = p.nodes.get("Add")!;
  writeFileSync(join(dir, "ail.lock.json"), JSON.stringify({ version: 1, nodes: { Add: { hash: compileHash(p, add), files: {}, by: "adopted", adopted: true } }, glue: {} }));
  expect(recordAdopted(load(dir))).toEqual([]);
  expect(JSON.parse(readFileSync(join(dir, "ail.lock.json"), "utf8")).nodes.Add.spec).toBe(specHash(p, add));
});
