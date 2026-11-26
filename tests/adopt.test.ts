// `ail adopt`: a spec written for an existing app, proved against it.
import { expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { adopt, e2eCheckPath } from "../src/adopt.ts";
import { compileHash } from "../src/hash.ts";
import { lint } from "../src/lint.ts";
import { loadProject } from "../src/project.ts";
import { KATA, freePort, load, tempProject } from "./helpers.ts";

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
  const port = freePort();
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

test("adopting suggests the .gitattributes lines that keep generated code out of PR diffs, until they are there", async () => {
  const { reviewAttributes } = await import("../src/adopt.ts");
  const dir = tempProject("areas");
  Bun.spawnSync(["git", "init", "-q"], { cwd: dir });
  const p = load(dir);
  expect(reviewAttributes(p).missing).toEqual(["src/gen/** linguist-generated=true", "ail.lock.json linguist-generated=true"]);
  writeFileSync(join(dir, ".gitattributes"), "src/gen/** linguist-generated=true\nail.lock.json   linguist-generated=true\n");
  expect(reviewAttributes(load(dir)).missing).toEqual([]);
  const r = await adopt(load(dir), { suggestReview: true });
  expect(r.review?.missing).toEqual([]);
});

test("adopting takes the checks' screenshots as proof and records the existing app as the build", async () => {
  const { plan } = await import("../src/plan.ts");
  const { verifyProject } = await import("../src/verify.ts");
  const { e2eShotsDir } = await import("../src/adopt.ts");
  const dir = tempProject("areas");
  // Checkout is AreaA's child, so the project lints and builds.
  const area = join(dir, "a", "a.ail.md");
  writeFileSync(area, readFileSync(area, "utf8").replace("  uses  Price", "  uses  Price\n  children  Checkout"));
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: system\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n```\n");
  const port = freePort();
  writeFileSync(join(dir, "server.ts"), `Bun.serve({ port: ${port}, fetch: () => new Response("receipt") });`);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ run: { legacy: { start: "bun server.ts", ready: `http://localhost:${port}`, env: { AIL_APP_URL: `http://localhost:${port}` } } } }));
  let p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  // Any platform: this "app" has no browser, so the check saves its own picture of what it saw.
  writeFileSync(file, `import { expect, test } from "bun:test";
import { join } from "node:path";
test("paying", async () => {
  const body = await (await fetch(process.env.AIL_APP_URL!)).text();
  expect(body).toBe("receipt");
  await Bun.write(join(process.env.AIL_SHOTS_DIR!, "paying.png"), body);
});
`);
  expect(plan(p).some((e) => e.status !== "fresh")).toBe(true); // nothing built yet
  const r = await adopt(p, { record: true });
  expect(r.ok).toBe(true);
  expect(r.results.find((x) => x.node === "Checkout")!.shots!.map((s) => s.test)).toEqual(["paying"]);
  p = load(dir);
  expect(JSON.parse(readFileSync(join(e2eShotsDir(p, p.nodes.get("Checkout")!), "shots.json"), "utf8")).shots).toEqual([{ test: "paying", file: "paying.png" }]);
  expect(r.recorded!.length).toBeGreaterThan(0);
  // the existing app is the build: nothing to rebuild, and nothing fails for lack of generated code
  expect(plan(p).filter((e) => e.status !== "fresh")).toEqual([]);
  expect(verifyProject(p).ok).toBe(true);
  // ...and the app ail build makes, so every build runs the end-to-end checks against it
  expect(r.runApp).toBe(true);
  expect(JSON.parse(readFileSync(join(dir, "ail.config.json"), "utf8")).run.app).toEqual(p.config.run!.legacy);
  const { build } = await import("../src/build.ts");
  const built = await build(p, { models: ["openai:none"], look: false });
  expect(built.e2e?.results).toEqual([expect.objectContaining({ node: "Checkout", status: "pass" })]);
  expect(built.ok).toBe(true);
  // a spec change after adopting makes that node, and the nodes using its contract, due for building
  const f = join(dir, p.nodes.get("Price")!.file);
  writeFileSync(f, readFileSync(f, "utf8").replace("price(1999) => 19", "price(1999) => 19\n      price(0) => 0"));
  expect(plan(load(dir)).filter((e) => e.status !== "fresh").map((e) => e.node).sort()).toEqual(["AreaA", "AreaB", "Price"]);
}, 60_000);

test("the app's services start first, seed data goes in through the app's API, and everything stops afterwards", async () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: experience\n  why   People pay.   <- AreaA\n  what\n    Scenario: an order is listed\n      Then the seeded order is shown\n```\n");
  const api = freePort();
  let web = freePort();
  while (web === api) web = freePort();
  // A backend that keeps orders in memory, and an app that only talks to it.
  writeFileSync(join(dir, "backend.ts"), `const orders: string[] = [];
Bun.serve({ port: ${api}, async fetch(req) {
  if (req.method === "POST") { orders.push(await req.text()); return new Response("ok"); }
  return Response.json(orders);
} });`);
  writeFileSync(join(dir, "app.ts"), `Bun.serve({ port: ${web}, async fetch(req) {
  const backend = process.env.BACKEND_URL!;
  if (req.method === "POST") return fetch(backend, { method: "POST", body: await req.text() });
  return new Response((await (await fetch(backend)).json()).join(","));
} });`);
  // Seed through the app's own API, never the backend's storage.
  writeFileSync(join(dir, "seed.ts"), `await fetch(process.env.AIL_APP_URL!, { method: "POST", body: "order-1" });`);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ run: { legacy: {
    services: { backend: { start: "bun backend.ts", ready: `http://localhost:${api}`, env: { BACKEND_URL: `http://localhost:${api}` } } },
    start: "bun app.ts", ready: `http://localhost:${web}`, env: { AIL_APP_URL: `http://localhost:${web}` },
    seed: "bun seed.ts",
  } } }));
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `import { expect, test } from "bun:test";
test("an order is listed", async () => {
  expect(await (await fetch(process.env.AIL_APP_URL!)).text()).toBe("order-1");
  expect(process.env.BACKEND_URL).toBe("http://localhost:${api}");
});
`);
  const r = await adopt(p);
  expect(r.error).toBeUndefined();
  expect(r.results.find((x) => x.node === "Checkout")!.status).toBe("pass");
  await Bun.sleep(300);
  const down = (port: number) => fetch(`http://localhost:${port}`).then(() => "up", () => "down");
  expect([await down(web), await down(api)]).toEqual(["down", "down"]);
}, 60_000);

test("a failing seed stops everything and says why", async () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: experience\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n```\n");
  const port = freePort();
  writeFileSync(join(dir, "app.ts"), `Bun.serve({ port: ${port}, fetch: () => new Response("x") });`);
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ run: { legacy: { start: "bun app.ts", ready: `http://localhost:${port}`, seed: "echo 'POST /orders: 422 invalid' >&2; exit 3" } } }));
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `import { test } from "bun:test";\ntest("paying", () => {});\n`);
  const r = await adopt(p);
  expect(r.error).toContain("seeding the app failed (3)");
  expect(r.error).toContain("422 invalid");
  await Bun.sleep(300);
  expect(await fetch(`http://localhost:${port}`).then(() => "up", () => "down")).toBe("down");
}, 60_000);

test("a build whose end-to-end checks can't run fails: it proves nothing", async () => {
  const { build } = await import("../src/build.ts");
  const dir = tempProject("areas");
  writeFileSync(join(dir, "a", "checkout.ail.md"), "```ail\nnode Checkout : flow   level: system\n  why   People pay.   <- AreaA\n  what\n    Scenario: paying\n      Then the receipt is shown\n```\n");
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ run: { legacy: { start: "true" } } }));
  const area = join(dir, "a", "a.ail.md");
  writeFileSync(area, readFileSync(area, "utf8").replace("  uses  Price", "  uses  Price\n  children  Checkout"));
  const p = load(dir);
  const file = e2eCheckPath(p, p.nodes.get("Checkout")!);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `import { test } from "bun:test";\ntest("paying", () => {});\n`);
  const r = await build(p, { models: ["openai:none"], look: false });
  expect(r.ok).toBe(false);
  expect(r.text).toContain("✗ app      end-to-end checks could not run");
  expect(r.text).not.toMatch(/^! app/m);
});
