// Checks in the target's language: `tests` in ail.config.json says where they
// live and which command runs one, and ail reads its JUnit or TRX report.
import { expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { adopt, e2eCheckPath } from "../src/adopt.ts";
import { pinOf, reportTests, withPin } from "../src/tests.ts";
import { load, tempProject, specFile } from "./helpers.ts";

const CHECKOUT = "```ail\nnode Checkout : flow   level: experience\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n    Scenario: paying twice\n      Then one receipt is shown\n```\n";

// A stand-in for any language's test runner: runs the "check" (a shell script) and writes a JUnit report.
const RUNNER = `#!/bin/sh
# usage: runner.sh <check> <report>
out=$(sh "$1")
code=$?
printf '<?xml version="1.0"?>\\n<testsuites><testsuite name="x">%s</testsuite></testsuites>\\n' "$out" > "$2"
exit $code
`;

function project(check: string, extra: Record<string, unknown> = {}) {
  const dir = tempProject("areas");
  writeFileSync(specFile(dir, "a/checkout/checkout.ail.md"), CHECKOUT);
  writeFileSync(join(dir, "runner.sh"), RUNNER);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({
    run: { legacy: { env: { AIL_APP: "receipt" } } },
    tests: { e2e: "checks/e2e/{dir}/{name}Checks.sh", command: "sh runner.sh {file} {report}", ...extra },
  }));
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, check);
  return { dir, p, file };
}

test("an end-to-end check in another language is run by the project's command, pinned in its comment syntax, and takes no screenshots", async () => {
  const { dir, p, file } = project(`# each scenario reports itself; there is nowhere to save a screen
[ -z "$AIL_SHOTS_DIR" ] || exit 2
[ "$AIL_APP" = receipt ] && [ "$AIL_CHECK_NODE" = Checkout ] || exit 1
echo '<testcase name="paying"/><testcase name="paying twice"/>'
`);
  expect(file).toBe(join(dir, "checks/e2e/a/checkout/CheckoutChecks.sh"));
  const r = await adopt(p);
  expect(r.error).toBeUndefined();
  const res = r.results.find((x) => x.node === "Checkout")!;
  expect(res.status).toBe("pass");
  expect(res.detail).toContain("2 scenario(s)");
  expect(existsSync(join(dir, "a", "checkout", "shots"))).toBe(false);
  expect(readFileSync(file, "utf8")).toStartWith("# ail-derived-from: Checkout@");
  // pinned now: a second run is not stale
  expect((await adopt(load(dir))).results.find((x) => x.node === "Checkout")!.status).toBe("pass");
});

test("a failing scenario is reported with its message from the report", async () => {
  const { p } = project(`echo '<testcase name="paying"/><testcase name="paying twice"><failure message="expected 1 receipt, saw 2"/></testcase>'
exit 1
`);
  const res = (await adopt(p)).results.find((x) => x.node === "Checkout")!;
  expect(res.status).toBe("fail");
  expect(res.detail).toContain("paying twice");
  expect(res.detail).toContain("expected 1 receipt, saw 2");
});

test("a command that reports no tests did not run, whatever its exit code", async () => {
  const { p } = project("echo ''\n");
  expect((await adopt(p)).results.find((x) => x.node === "Checkout")!.status).toBe("fail");
});

test("the checks are prepared once before they run, and a failed preparation stops the run", async () => {
  const { p } = project("echo '<testcase name=\"paying\"/>'\n", { prepare: "echo cannot build the checks; exit 3" });
  const r = await adopt(p);
  expect(r.error).toContain("cannot build the checks");
});

test("a TRX report is read as well as JUnit", () => {
  const trx = `<?xml version="1.0"?><TestRun><Results>
    <UnitTestResult testName="paying" outcome="Passed" />
    <UnitTestResult testName="paying &amp; leaving" outcome="Failed"><Output><ErrorInfo><Message>no receipt</Message></ErrorInfo></Output></UnitTestResult>
    <UnitTestResult testName="later" outcome="NotExecuted" />
  </Results></TestRun>`;
  expect(reportTests(trx)).toEqual([{ name: "paying", ok: true }, { name: "paying & leaving", ok: false, message: "no receipt" }]);
});

test("a pin is read and written in any language's comment syntax", () => {
  expect(withPin("x.py", "import pytest\n", "Price", "ab")).toBe("# ail-derived-from: Price@ab\nimport pytest\n");
  expect(pinOf(withPin("X.cs", "// ail-derived-from: Price@00\nclass X {}\n", "Price", "ab"))).toEqual({ node: "Price", hash: "ab" });
  expect(pinOf("-- ail-derived-from: Q@cd\n")).toEqual({ node: "Q", hash: "cd" });
});


test("pruning a foreign target's derived checks keeps the end-to-end checks beside them", async () => {
  const { prune } = await import("../src/compile.ts");
  const { dir, file } = project("// ail-derived-from: Checkout@00\n");
  const root = join(dir, "root.ail.md");
  writeFileSync(root, readFileSync(root, "utf8").replace(/target\n/, "target\n  checks.path  checks/{dir}/{name}Tests.sh\n  checks.run   sh {files}\n"));
  const p = load(dir);
  expect(p.target?.settings["checks.path"]).toBe("checks/{dir}/{name}Tests.sh");
  mkdirSync(join(dir, "checks/a"), { recursive: true });
  writeFileSync(join(dir, "checks/a/GoneTests.sh"), "# ail-derived-from: Gone@00\n");
  const r = prune(p);
  expect(r.removed).toContain("checks/a/GoneTests.sh");
  expect(existsSync(file)).toBe(true);
});
