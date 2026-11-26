// `ail adopt`: prove that a spec describes a running app.
//
// Bringing an existing app under AIL means writing its spec from what people
// say (the why), what the app does (the what) and what the code decides (the
// how). End-to-end checks, one file per node, drive the real app in a browser
// through the node's scenarios, with whatever drives that kind of app (a
// browser, a simulator, a process). `ail adopt` starts the app as the config's
// `run` says and runs them: against the legacy app, to prove the spec is right,
// and against the one `ail build` made, to prove it behaves the same.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { compileHash, oracleHash, specHash } from "./hash.ts";
import { adoptedFresh } from "./plan.ts";
import { hasLook, judgeShots, type LookResult } from "./look.ts";
import type { Provider } from "./providers/index.ts";
import { junitTests, shotsDir, slugOf, type Shot } from "./shots.ts";
import type { AilNode } from "./parse.ts";
import { isCompilable, kebab, type Project, type RunSpec } from "./project.ts";
import { lockPath, readLock, writeLock } from "./lock.ts";
import { checkHeader, checksDir, errorExcerpt, runBunTest } from "./verify.ts";

/** Where a node's end-to-end check lives: checks/e2e/<dir>/<kebab>.e2e.ts (not picked up by a plain `bun test`). */
export const e2eCheckPath = (p: Project, n: AilNode) => join(checksDir(p), "e2e", n.dir, `${kebab(n.name)}.e2e.ts`);

/** Nodes whose scenarios a person could play through in the app: its flows and the root. */
export const observable = (n: AilNode) => n.scenarios.length > 0 && (n.kind === "flow" || n.kind === "system");

export interface AdoptResult { node: string; file: string | null; status: "pass" | "fail" | "stale" | "missing"; detail: string; shots?: Shot[] }

/** Where a flow's end-to-end screenshots go: checks/shots/e2e/<dir>/<kebab>/, handed to its check as AIL_SHOTS_DIR. */
export const e2eShotsDir = (p: Project, n: AilNode) => join(shotsDir(p), "e2e", n.dir, kebab(n.name));

/** The file name a check saves a scenario's screenshot under: the test's name as a slug, plus ".png". */
export const shotFileName = (test: string) => `${slugOf(test)}.png`;

/** Pair the screenshots a check saved with its tests (in run order), and write the folder's index. */
export function collectShots(dir: string, node: string, tests: string[]): { shots: Shot[]; missing: string[] } {
  const shots: Shot[] = [], missing: string[] = [];
  for (const t of tests) {
    const f = join(dir, shotFileName(t));
    if (existsSync(f)) shots.push({ node, test: t, file: f }); else missing.push(t);
  }
  if (shots.length) writeFileSync(join(dir, "shots.json"), JSON.stringify({ node, shots: shots.map((s) => ({ test: s.test, file: relative(dir, s.file) })) }, null, 2) + "\n");
  return { shots, missing };
}

/** Which app to run: the given name, else "legacy" while adopting, else "app". */
export function runSpecName(p: Project, name?: string): string | null {
  const run = p.config.run ?? {};
  if (name) { if (!run[name]) throw new Error(`no run.${name} in ail.config.json (known: ${Object.keys(run).join(", ") || "none"})`); return name; }
  return run.legacy ? "legacy" : run.app ? "app" : null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function isReady(ready: string, cwd: string): Promise<boolean> {
  if (/^https?:\/\//.test(ready)) {
    try { return (await fetch(ready, { signal: AbortSignal.timeout(3000) })).status < 500; } catch { return false; }
  }
  return Bun.spawnSync(["sh", "-c", ready], { cwd, stdout: "ignore", stderr: "ignore" }).exitCode === 0;
}

/** Start one process as `spec` says and wait until it is ready. stop() ends it and everything it started. */
async function startOne(p: Project, what: string, spec: RunSpec, env: Record<string, string>, log: (s: string) => void): Promise<() => void> {
  const cwd = resolve(p.root, spec.cwd ?? ".");
  let child: ReturnType<typeof spawn> | null = null;
  let output = "";
  if (spec.start) {
    log(`starting ${what}: ${spec.start}`);
    // Its own process group, so stopping it also stops what it started (a dev server, a simulator bridge).
    child = spawn("sh", ["-c", spec.start], { cwd, detached: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } });
    const keep = (d: Buffer) => { output = (output + d.toString()).slice(-4000); };
    child.stdout?.on("data", keep);
    child.stderr?.on("data", keep);
  }
  const stop = () => { if (child?.pid) try { process.kill(-child.pid, "SIGTERM"); } catch { /* already gone */ } };
  const tail = () => (output ? `:\n${output.trim().split("\n").slice(-10).join("\n")}` : "");
  if (spec.ready) {
    const until = Date.now() + (spec.timeout ?? 120) * 1000;
    while (!(await isReady(spec.ready, cwd))) {
      if (child && child.exitCode !== null) { stop(); throw new Error(`${what} exited (${child.exitCode}) before it was ready${tail()}`); }
      if (Date.now() > until) { stop(); throw new Error(`${what} was not ready after ${spec.timeout ?? 120}s (waiting for ${spec.ready})${tail()}`); }
      await sleep(500);
    }
  }
  return stop;
}

/**
 * Start what the app needs (its services, in order), then the app, wait until
 * each is ready, and create the seed data through the app's own interface.
 * stop() ends them all, the app first.
 */
export async function startApp(p: Project, spec: RunSpec, log: (s: string) => void = () => {}): Promise<{ stop: () => void }> {
  const stops: (() => void)[] = [];
  const stopAll = () => { for (const s of [...stops].reverse()) s(); };
  // Every service's env reaches the app, the seed and the checks (e.g. where the backend listens).
  const env = { ...Object.assign({}, ...Object.values(spec.services ?? {}).map((s) => s.env ?? {})), ...(spec.env ?? {}) } as Record<string, string>;
  try {
    for (const [name, service] of Object.entries(spec.services ?? {})) stops.push(await startOne(p, `the service ${name}`, service, env, log));
    stops.push(await startOne(p, "the app", spec, env, log));
    if (spec.seed) {
      log(`seeding through the app: ${spec.seed}`);
      const r = Bun.spawnSync(["sh", "-c", spec.seed], { cwd: resolve(p.root, spec.cwd ?? "."), env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe", timeout: (spec.seedTimeout ?? 120) * 1000 });
      if (r.exitCode !== 0) throw new Error(`seeding the app failed (${r.exitCode ?? "timed out"}):\n${(r.stdout.toString() + r.stderr.toString()).trim().split("\n").slice(-10).join("\n")}`);
    }
  } catch (e) {
    stopAll();
    throw e;
  }
  return { stop: stopAll };
}

/** The env the end-to-end checks get: every service's, then the app's own. */
export const runEnv = (spec: RunSpec): Record<string, string> =>
  ({ ...Object.assign({}, ...Object.values(spec.services ?? {}).map((s) => s.env ?? {})), ...(spec.env ?? {}) });

export interface AdoptReport { ok: boolean; app: string; results: AdoptResult[]; error?: string; review?: { file: string; missing: string[] }; looks?: LookResult[]; recorded?: string[] }

/**
 * Record each compilable node that isn't built yet (or was adopted from an
 * older spec) as built by the existing app, at its current compile hash.
 */
export function recordAdopted(p: Project): string[] {
  const lock = readLock(p);
  const done: string[] = [];
  let backfilled = false;
  for (const n of p.ordered.filter((x) => isCompilable(p, x))) {
    const e = lock.nodes[n.name];
    const hash = compileHash(p, n);
    if (e && !e.adopted) continue; // built by ail: leave it
    // Still adopted at this spec: only fill in the spec hash of a lock written before it was kept.
    if (e?.adopted && e.hash === hash) { if (!e.spec) { e.spec = specHash(p, n); backfilled = true; } continue; }
    if (adoptedFresh(p, n, e)) continue;
    lock.nodes[n.name] = { hash, spec: specHash(p, n), files: {}, by: "adopted", adopted: true };
    done.push(n.name);
  }
  if (done.length || backfilled) writeLock(p, lock);
  return done;
}

/**
 * Start the app named in run (or the one already running), run every
 * end-to-end check (or those of `names`) against it, and stop it. A check
 * without a pin is pinned to the node's current spec on its first run; one
 * pinned to an older spec is reported stale and not run.
 */
export async function adopt(p: Project, opts: {
  app?: string; names?: string[]; log?: (s: string) => void; suggestReview?: boolean;
  /** A model that compares each flow's screenshots with its look (skipped without one). */
  judge?: Provider;
  /** Record every node as built by this (legacy) app once its spec is proven: `ail adopt` does. */
  record?: boolean;
} = {}): Promise<AdoptReport> {
  // Adopting is the moment to set up review: suggest keeping generated code out of PR diffs.
  const review = opts.suggestReview ? reviewAttributes(p) : undefined;
  const name = runSpecName(p, opts.app);
  const spec = name ? p.config.run![name]! : null;
  const label = name ? `run.${name}` : "no app";
  const names = opts.names ?? [];
  const results: AdoptResult[] = [];
  const toRun: { n: AilNode; abs: string; file: string }[] = [];
  for (const n of p.ordered.filter((x) => !names.length || names.includes(x.name))) {
    const abs = e2eCheckPath(p, n);
    const file = relative(p.root, abs);
    if (!existsSync(abs)) {
      if (observable(n)) results.push({ node: n.name, file: null, status: "missing", detail: `no end-to-end check at ${file}` });
      continue;
    }
    const text = readFileSync(abs, "utf8");
    const pinned = /^\/\/ ail-derived-from:\s*\w+@([0-9a-f]+)/.exec(text)?.[1];
    if (!pinned) writeFileSync(abs, `${checkHeader(p, n)}\n${text}`);
    else if (pinned !== oracleHash(p, n).slice(0, 16)) {
      results.push({ node: n.name, file, status: "stale", detail: "the node's spec changed since this check was written; update the check, then run again" });
      continue;
    }
    toRun.push({ n, abs, file });
  }
  if (!toRun.length) return { ok: results.every((r) => r.status === "missing"), app: label, results, review };
  if (!spec) return { ok: false, app: label, results, review, error: "there is no run.legacy or run.app in ail.config.json saying how to start the app; find out how (its README, scripts, CI config, build files) and add it" };
  let app: { stop: () => void };
  try { app = await startApp(p, spec, opts.log); }
  catch (e) { return { ok: false, app: label, results, review, error: (e as Error).message }; }
  try {
    for (const { n, abs, file } of toRun) {
      // A fresh folder for the screenshots the check takes as proof, however its platform takes them.
      const shotsAt = e2eShotsDir(p, n);
      rmSync(shotsAt, { recursive: true, force: true });
      mkdirSync(shotsAt, { recursive: true });
      const report = join(mkdtempSync(join(tmpdir(), "ail-e2e-")), "report.xml");
      // Run from outside the project, so its test setup (a simulated DOM) stays out of a real app's way.
      const r = runBunTest(tmpdir(), [abs], { ...runEnv(spec), AIL_SHOTS_DIR: shotsAt }, ["--reporter=junit", `--reporter-outfile=${report}`]);
      const tests = existsSync(report) ? junitTests(readFileSync(report, "utf8")) : [];
      const { shots, missing: unpictured } = collectShots(shotsAt, n.name, tests);
      if (!shots.length) rmSync(shotsAt, { recursive: true, force: true });
      const pictured = !tests.length ? "" : !shots.length ? "; no screenshots saved (the check should save one per scenario into AIL_SHOTS_DIR)" : unpictured.length ? `; no screenshot for: ${unpictured.join(", ")}` : `, each with a screenshot`;
      results.push(r.ok
        ? { node: n.name, file, status: "pass", detail: `${r.passes} scenario(s) behave as specified${pictured}`, shots }
        : { node: n.name, file, status: "fail", detail: `${r.failures.length ? r.failures.join("; ") : "the check did not run"}\n${errorExcerpt(r.output, 20)}`, shots });
    }
  } finally { app.stop(); }
  // The screenshots are proof of the look too: a model compares them with it.
  const looks: LookResult[] = [];
  if (opts.judge) for (const r of results) {
    const n = p.nodes.get(r.node)!;
    if (r.status !== "pass" || !r.shots?.length || !hasLook(n)) continue;
    opts.log?.(`${n.name}: comparing its screenshots with its look`);
    looks.push(await judgeShots(p, n, r.shots, opts.judge, () => {}, true).catch((e) => ({ node: n.name, ok: true, problems: [], shots: [], skipped: (e as Error).message })));
  }
  const ok = results.every((r) => r.status === "pass" || r.status === "missing") && looks.every((l) => l.ok);
  // Proven on the existing app: record every node as built by it, so the first ail build has nothing to redo.
  const recorded = ok && opts.record ? recordAdopted(p) : [];
  return { ok, app: label, results, review, looks, recorded };
}

/**
 * The .gitattributes lines that keep this project's generated code out of
 * pull request diffs (it stays committed; GitHub collapses it), minus those
 * the repository already has. Paths are relative to the repository's root.
 */
export function reviewAttributes(p: Project): { file: string; missing: string[] } {
  const top = Bun.spawnSync(["git", "rev-parse", "--show-toplevel"], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  const root = top.exitCode === 0 ? top.stdout.toString().trim() : p.root;
  const prefix = relative(root, p.root).split("\\").join("/");
  const at = (rel: string) => (prefix ? `${prefix}/${rel}` : rel);
  const globs = (p.target?.settings["generated"] ?? "").split(/[\s,]+/).filter(Boolean);
  const wanted = [...globs, relative(p.root, lockPath(p)).split("\\").join("/")].map((g) => `${at(g)} linguist-generated=true`);
  const file = join(root, ".gitattributes");
  // Ask git whether a path each pattern covers is marked already: any pattern that covers it counts.
  const marked = (line: string) => {
    const sample = line.split(" ")[0]!.replace(/\*\*/g, "a/b").replace(/\*/g, "x");
    const r = Bun.spawnSync(["git", "check-attr", "linguist-generated", "--", sample], { cwd: root, stdout: "pipe", stderr: "pipe" });
    return r.exitCode === 0 && /: linguist-generated: (true|set)\s*$/.test(r.stdout.toString());
  };
  return { file, missing: wanted.filter((w) => !marked(w)) };
}

/** The suggestion, when lines are missing; empty otherwise. */
export function formatReview(review: { file: string; missing: string[] }): string {
  if (!review.missing.length) return "";
  return `    · to keep generated code out of pull request diffs (it stays committed, and GitHub collapses it), add to ${review.file}:\n${review.missing.map((l) => `        ${l}`).join("\n")}`;
}

export function formatAdopt(r: AdoptReport): string {
  const app = r.app;
  const icon = { pass: "✓", fail: "✗", stale: "!", missing: "·" };
  const ran = r.results.filter((x) => x.status !== "missing");
  const missing = r.results.filter((x) => x.status === "missing");
  const lines = r.error
    ? [`✗ app      ${r.error}`]
    : [`${r.ok ? "✓" : "✗"} app      ${ran.filter((x) => x.status === "pass").length} of ${ran.length} flow(s) behave as their spec says (${app})`];
  for (const x of ran.filter((y) => y.status !== "pass")) lines.push(`    ${icon[x.status]} ${x.node} ${x.status}: ${x.detail.split("\n").join("\n      ")}`);
  if (missing.length) lines.push(`    · ${missing.length} node(s) with scenarios have no end-to-end check yet: ${missing.map((x) => x.node).join(", ")}`);
  for (const l of r.looks ?? []) lines.push(l.skipped ? `    · ${l.node}: screenshots not compared with its look (${l.skipped})` : l.ok ? `    ✓ ${l.node}: ${l.shots.length} screenshot(s) match its look` : `    ✗ ${l.node}: its screenshots don't match its look\n${l.problems.map((x) => `        - ${x}`).join("\n")}`);
  if (r.recorded?.length) lines.push(`    ✓ recorded ${r.recorded.length} node(s) as built by the existing app in the lock file, so ail build only builds what changes from now on`);
  if (r.review) { const tip = formatReview(r.review); if (tip) lines.push(tip); }
  return lines.join("\n");
}
