// A node with a look whose code is written by hand (adopted, `@existing`, or of a kind the target doesn't build)
// still gets a derived check: it tests the app's own code, and pictures it. A check in another language saves each
// scenario's final screen itself, where AIL_SHOTS_DIR says; ail numbers them by the node's scenarios.
import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { checksToDerive, shotInstructions } from "../src/compile.ts";
import { readLock } from "../src/lock.ts";
import { recordLook, unjudged } from "../src/look.ts";
import { handBuilt, nodeShotsDir, refreshNodeShots, staleShots } from "../src/shots.ts";
import { checkPath, needsHandCheck, stampCheck, verifyNode, verifyProject } from "../src/verify.ts";
import { load, specFile, tempProject } from "./helpers.ts";

const RECEIPT = "```ail\nnode Receipt : view   level: experience\n  why   People see what they paid.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n    Scenario: paying twice\n      Then one receipt is shown\n  look\n    layout    a card with the total\n```\n";

// The check, as a shell script: each "test" passes and, given AIL_SHOTS_DIR, saves its screen.
const CHECK = `[ -n "$AIL_SHOTS_DIR" ] && printf png > "$AIL_SHOTS_DIR/paying.png" && printf png > "$AIL_SHOTS_DIR/paying-twice.png"
exit \${FAIL:-0}
`;

function project() {
  const dir = tempProject("areas");
  const root = join(dir, "root.ail.md");
  // Checks in the target's own language; and no path for views, so a view is written by hand.
  writeFileSync(root, readFileSync(root, "utf8").replace("  path.view  src/gen/{dir}/{kebab}.tsx\n", "").replace(/target\n/, "target\n  checks.path  checks/{dir}/{name}Tests.sh\n  checks.run   sh {files}\n"));
  const area = join(dir, "a", "a.ail.md");
  writeFileSync(area, readFileSync(area, "utf8").replace("  uses  Price", "  uses  Price\n  children  Receipt"));
  writeFileSync(specFile(dir, "a/receipt/receipt.ail.md"), RECEIPT);
  const p = load(dir);
  return { dir, p, n: p.nodes.get("Receipt")! };
}

const writeCheck = (dir: string, p: ReturnType<typeof load>, n: ReturnType<typeof project>["n"]) => {
  const abs = join(dir, checkPath(p, n));
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, stampCheck(p, n, CHECK));
};

test("a node with a look written by hand gets a derived check, which ail runs though it builds nothing for it", () => {
  const { dir, p, n } = project();
  expect(handBuilt(p, n)).toBe(true);
  expect(needsHandCheck(p, n)).toBe(true);
  expect(checksToDerive(p, [n]).map((x) => x.name)).toEqual(["Receipt"]);
  expect(verifyNode(p, n).ok).toBe(false);
  writeCheck(dir, p, n);
  const q = load(dir);
  expect(checksToDerive(q, [q.nodes.get("Receipt")!])).toEqual([]);
  const v = verifyProject(q);
  expect(v.results.find((r) => r.node === "Receipt")!.ok).toBe(true);
});

test("its check is told where to save each scenario's screen, and ail numbers them by the node's scenarios", async () => {
  const { dir, p, n } = project();
  expect(shotInstructions(p, n).join("\n")).toContain(`"paying twice" → paying-twice.png`);
  writeCheck(dir, p, n);
  const q = load(dir), r = q.nodes.get("Receipt")!;
  expect(staleShots(q).map((x) => x.name)).toEqual(["Receipt"]);
  const shots = await refreshNodeShots(q, r);
  expect(shots.map((s) => s.test)).toEqual(["paying", "paying twice"]);
  expect(readdirSync(nodeShotsDir(q, r)).sort()).toEqual(["01-paying.png", "02-paying-twice.png", "shots.json"]);
  // Keyed to the check it came from, since no build of ail's made the code.
  expect(readLock(q).hand?.Receipt?.shots).toBe(readFileSync(join(dir, checkPath(q, r)), "utf8").match(/@([0-9a-f]+)/)![1]);
  expect(staleShots(q)).toEqual([]);
  expect(unjudged(q)).toEqual(["Receipt"]);
  recordLook(q, "Receipt");
  expect(unjudged(q)).toEqual([]);
  // The app's own code changed what the screen shows: its spec and check did not change, but the look is compared again.
  writeFileSync(join(nodeShotsDir(q, r), "01-paying.png"), "another png");
  expect(unjudged(q)).toEqual(["Receipt"]);
});

test("a check that fails takes no screens", async () => {
  const { dir, p, n } = project();
  writeCheck(dir, p, n);
  process.env.FAIL = "1";
  try {
    await expect(refreshNodeShots(load(dir), n)).rejects.toThrow("check failed");
  } finally {
    delete process.env.FAIL;
  }
  expect(existsSync(nodeShotsDir(p, n))).toBe(false);
});

test("a kind may have checks of its own, in pairs: a view's need the UI toolkit", async () => {
  const { lint } = await import("../src/lint.ts");
  const { dir } = project();
  const root = join(dir, "root.ail.md");
  writeFileSync(root, readFileSync(root, "utf8").replace("  checks.run   sh {files}\n", "  checks.run   sh {files}\n  checks.path.view  ui-checks/{dir}/{name}Tests.sh\n  checks.run.view   FAIL=0 sh {files}\n"));
  const p = load(dir), n = p.nodes.get("Receipt")!;
  expect(checkPath(p, n)).toBe("ui-checks/a/receipt/ReceiptTests.sh");
  expect(checkPath(p, p.nodes.get("AreaA")!)).toBe("checks/a/AreaATests.sh");
  writeCheck(dir, p, n);
  expect(verifyNode(load(dir), n).ok).toBe(true);
  expect(lint(p).filter((d) => d.code === "checks-incomplete")).toEqual([]);
  writeFileSync(root, readFileSync(root, "utf8").replace("  checks.run.view   FAIL=0 sh {files}\n", ""));
  expect(lint(load(dir)).filter((d) => d.code === "checks-incomplete").map((d) => d.message)).toEqual([expect.stringContaining("`checks.path.view` needs `checks.run.view`")]);
});
