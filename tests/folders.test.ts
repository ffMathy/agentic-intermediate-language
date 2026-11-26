import { expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compile, prune } from "../src/compile.ts";
import { buildContext } from "../src/context.ts";
import { renderNode, renderReview } from "../src/lens.ts";
import { lint } from "../src/lint.ts";
import { plan } from "../src/plan.ts";
import { modulePath } from "../src/project.ts";
import { getProvider } from "../src/providers/index.ts";
import { verifyProject } from "../src/verify.ts";
import { load, mockFile, reply, tempProject } from "./helpers.ts";

const PRICE = `export function price(minor: number): number {\n  return Math.floor(minor / 100);\n}`;
const A = `import { price } from "../lib/price";\n\nexport function basketTotal(items: number[]): number {\n  return price(items.reduce((sum, item) => sum + item, 0));\n}`;
const B = (from: string) => `import { price } from "${from}";\n\nexport function receiptLine(minor: number): string {\n  return \`\${price(minor)} kr\`;\n}`;

function compiled(dir = tempProject("areas")) {
  const provider = getProvider(`mock:${mockFile(dir, {
    Price: [reply("src/gen/lib/price.ts", PRICE)],
    AreaA: [reply("src/gen/a/area-a.ts", A)],
    AreaB: [reply("src/gen/b/area-b.ts", B("../lib/price")), reply("src/gen/b/deep/area-b.ts", B("../../lib/price"))],
  })}`);
  return { dir, provider };
}

test("generated paths and imports mirror the spec's folders", () => {
  const p = load(tempProject("areas"));
  expect(modulePath(p, p.nodes.get("Price")!)).toBe("src/gen/lib/price.ts");
  expect(modulePath(p, p.nodes.get("AreaA")!)).toBe("src/gen/a/area-a.ts");
  expect(buildContext(p, p.nodes.get("AreaB")!)).toContain('### Price — built at src/gen/lib/price.ts, so import from "../lib/price"');
});

test("a shared node has one owner and many users, and lints clean", () => {
  const p = load(tempProject("areas"));
  expect(lint(p).filter((d) => d.severity === "error")).toEqual([]);
  expect(renderNode(p, p.nodes.get("Price")!)).toContain("used by:  AreaA (a/), AreaB (b/)");
});

test("a claim may be refined by a shared node that a descendant uses — and not otherwise", () => {
  const dir = tempProject("areas");
  for (const f of ["a/a.ail.md", "b/b.ail.md"]) writeFileSync(join(dir, f), readFileSync(join(dir, f), "utf8").replace("  uses  Price\n", ""));
  expect(lint(load(dir)).map((d) => d.code)).toContain("bad-refinement");
});

test("two areas compile against the shared node and verify", async () => {
  const { dir, provider } = compiled();
  const out = await compile(load(dir), [], { provider });
  expect(out.map((o) => o.status)).toEqual(["compiled", "compiled", "compiled"]);
  expect(verifyProject(load(dir)).ok).toBe(true);
});

test("moving a spec file into a subfolder moves its output", async () => {
  const { dir, provider } = compiled();
  await compile(load(dir), [], { provider });
  mkdirSync(join(dir, "b/deep"));
  renameSync(join(dir, "b/b.ail.md"), join(dir, "b/deep/b.ail.md"));
  expect(plan(load(dir)).find((e) => e.node === "AreaB")).toMatchObject({ status: "stale", reason: "moved from src/gen/b/area-b.ts" });
  const out = await compile(load(dir), [], { provider });
  expect(out.find((o) => o.node === "AreaB")!.status).toBe("compiled");
  expect(existsSync(join(dir, "src/gen/b/area-b.ts"))).toBe(false);
  expect(existsSync(join(dir, "src/gen/b/deep/area-b.ts"))).toBe(true);
});

test("removed nodes show as orphaned and prune deletes their untouched output", async () => {
  const { dir, provider } = compiled();
  await compile(load(dir), [], { provider });
  rmSync(join(dir, "b/b.ail.md"));
  writeFileSync(join(dir, "root.ail.md"), readFileSync(join(dir, "root.ail.md"), "utf8").replace("AreaA, AreaB", "AreaA"));
  expect(plan(load(dir)).find((e) => e.node === "AreaB")!.status).toBe("orphaned");
  expect(prune(load(dir)).removed).toEqual(["src/gen/b/area-b.ts"]);
  expect(plan(load(dir)).some((e) => e.status === "orphaned")).toBe(false);
});

test("children belong in their parent's folder or below", () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "lib/lib.ail.md"), readFileSync(join(dir, "lib/lib.ail.md"), "utf8").replace("children  Price", "children  Price, AreaB"));
  writeFileSync(join(dir, "root.ail.md"), readFileSync(join(dir, "root.ail.md"), "utf8").replace("AreaA, AreaB", "AreaA, Lib"));
  writeFileSync(join(dir, "b/b.ail.md"), readFileSync(join(dir, "b/b.ail.md"), "utf8").replace("<- Shop", "<- Lib"));
  expect(lint(load(dir)).find((d) => d.code === "misplaced-node")?.node).toBe("AreaB");
});

test("nodes over the size budget are asked to split", () => {
  const dir = tempProject("areas");
  writeFileSync(join(dir, "ail.config.json"), JSON.stringify({ maxNodeLines: 5 }));
  const d = lint(load(dir)).find((x) => x.code === "node-too-large" && x.node === "Price")!;
  expect(d.message).toContain("split it into children, e.g. in a lib/price/ folder");
});

test("review shows every area a shared contract change reaches", () => {
  const dir = tempProject("areas");
  const git = (...args: string[]) => Bun.spawnSync(["git", "-c", "user.email=t@t", "-c", "user.name=t", ...args], { cwd: dir });
  git("init", "-q"); git("add", "-A"); git("commit", "-qm", "base");
  writeFileSync(join(dir, "lib/price.ail.md"), readFileSync(join(dir, "lib/price.ail.md"), "utf8").replace("price(1999) => 19", "price(1999) => 19\n      price(0) => 0"));
  const r = renderReview(load(dir), "HEAD");
  expect(r).toContain("✎ Price");
  expect(r).toContain("**Contract changed** — this reaches AreaA (system, a/), AreaB (system, b/)");
});

test("prune also removes the derived checks of removed and moved nodes", () => {
  const dir = tempProject("areas");
  mkdirSync(join(dir, "checks/b"), { recursive: true });
  mkdirSync(join(dir, "checks/old"), { recursive: true });
  writeFileSync(join(dir, "checks/old/gone.test.ts"), "// ail-derived-from: Gone@abc\n");
  writeFileSync(join(dir, "checks/old/area-b.test.ts"), "// ail-derived-from: AreaB@abc\n");
  writeFileSync(join(dir, "checks/b/hand-written.test.ts"), "// no header: written by a person\n");
  expect(prune(load(dir)).removed.sort()).toEqual(["checks/old/area-b.test.ts", "checks/old/gone.test.ts"]);
  expect(existsSync(join(dir, "checks/b/hand-written.test.ts"))).toBe(true);
});
