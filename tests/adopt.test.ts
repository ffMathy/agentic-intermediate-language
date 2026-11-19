// `ail adopt`: a spec written for an existing app, proved against it.
import { expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { adopt, e2eCheckPath } from "../src/adopt.ts";
import { compileHash } from "../src/hash.ts";
import { lint } from "../src/lint.ts";
import { loadProject } from "../src/project.ts";
import { KATA, load, tempProject } from "./helpers.ts";

const installed = existsSync(join(KATA, "node_modules", "react")) && existsSync(join(KATA, "node_modules", "playwright"));
const chromium = await import("playwright").then(async ({ chromium }) => { await (await chromium.launch()).close(); return true; }).catch(() => false);

test("sources are provenance: they change no hash and never reach a compiler", async () => {
  const { buildContext } = await import("../src/context.ts");
  const dir = tempProject("areas");
  const before = load(dir);
  const n = before.nodes.get("Price")!;
  const f = join(dir, n.file);
  writeFileSync(f, readFileSync(f, "utf8").replace("node Price : fn", "node Price : fn").replace(/(node Price[^\n]*\n)/, `$1  sources   ASANA-1234; interview with the shop owner, 2026-11-19\n`));
  const after = load(dir);
  expect(after.nodes.get("Price")!.sections.some((s) => s.key === "sources")).toBe(true);
  expect(compileHash(after, after.nodes.get("Price")!)).toBe(compileHash(before, n));
  expect(buildContext(after, after.nodes.get("Price")!)).not.toContain("ASANA-1234");
  expect(lint(after).filter((d) => d.code === "unknown-section")).toEqual([]);
});

test("a reason nobody could confirm stays visible as a warning", () => {
  const dir = tempProject("areas");
  const p = load(dir);
  const f = join(dir, p.nodes.get("Price")!.file);
  writeFileSync(f, readFileSync(f, "utf8").replace(/(node Price[^\n]*\n)/, `$1  how       round down\n              because "unknown, confirm with the owner"\n`));
  const d = lint(load(dir)).filter((x) => x.code === "open-question");
  expect(d.length).toBe(1);
  expect(d[0]!.severity).toBe("warning");
});

test("a check pinned to an older spec is reported stale, and flows without a check are listed", async () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: experience\n  why   People pay for what they picked.   <- AreaA\n  what\n    Scenario: paying\n      Given a full basket\n      When the person pays\n      Then the receipt is shown\n```\n\n```ail\nnode Browse : flow   level: experience\n  why   People find things.   <- AreaA\n  what\n    Scenario: looking\n      Given the shop is open\n      Then the products are listed\n```\n");
  const p = load(dir);
  const flow = p.nodes.get("Checkout")!;
  const file = e2eCheckPath(p, flow);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `// ail-derived-from: ${flow.name}@0000000000000000\nimport { test } from "bun:test";\ntest("x", () => {});\n`);
  const r = await adopt(p);
  expect(r.results.find((x) => x.node === flow.name)!.status).toBe("stale");
  expect(r.results.find((x) => x.node === "Browse")!.status).toBe("missing");
  expect(r.ok).toBe(false);
});

test("without a run entry, adopt says to find out how to start the app", async () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: experience\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n```\n");
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `import { test } from "bun:test";\ntest("paying", () => {});\n`);
  const r = await adopt(p);
  expect(r.ok).toBe(false);
  expect(r.error).toContain("find out how");
});

test("the app is started as run says, checked, and stopped; any platform, here a plain process", async () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: experience\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n```\n");
  const port = 32000 + Math.floor(Math.random() * 1000);
  writeFileSync(join(dir, "server.ts"), `Bun.serve({ port: ${port}, fetch: () => new Response("receipt") });`);
  const cfg = { run: { legacy: { start: "bun server.ts", ready: `http://localhost:${port}`, env: { AIL_APP_URL: `http://localhost:${port}` } } } };
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify(cfg));
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `import { expect, test } from "bun:test";\ntest("paying", async () => { expect(await (await fetch(process.env.AIL_APP_URL!)).text()).toBe("receipt"); });\n`);
  const r = await adopt(p);
  expect(r.app).toBe("run.legacy");
  expect(r.results).toEqual([expect.objectContaining({ node: "Checkout", status: "pass" })]);
  // stopped afterwards
  await Bun.sleep(300);
  expect(await fetch(`http://localhost:${port}`).then(() => "up", () => "down")).toBe("down");
}, 60_000);

test.skipIf(!installed || !chromium)("the kata's play flow behaves as its spec says, in a real browser", async () => {
  const r = await adopt(loadProject(KATA), { names: ["PlayAGame"] });
  expect(r.error).toBeUndefined();
  expect(r.results).toEqual([expect.objectContaining({ node: "PlayAGame", status: "pass" })]);
}, 120_000);
