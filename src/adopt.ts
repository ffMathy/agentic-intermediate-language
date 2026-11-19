// `ail adopt`: prove that a spec describes a running app.
//
// Bringing an existing app under AIL means writing its spec from what people
// say (the why), what the app does (the what) and what the code decides (the
// how). End-to-end checks, one file per node, drive the real app in a browser
// through the node's scenarios, with whatever drives that kind of app (a
// browser, a simulator, a process). `ail adopt` starts the app as the config's
// `run` says and runs them: against the legacy app, to prove the spec is right,
// and against the one `ail build` made, to prove it behaves the same.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { oracleHash } from "./hash.ts";
import type { AilNode } from "./parse.ts";
import { kebab, type Project, type RunSpec } from "./project.ts";
import { checkHeader, checksDir, errorExcerpt, runBunTest } from "./verify.ts";

/** Where a node's end-to-end check lives: checks/e2e/<dir>/<kebab>.e2e.ts (not picked up by a plain `bun test`). */
export const e2eCheckPath = (p: Project, n: AilNode) => join(checksDir(p), "e2e", n.dir, `${kebab(n.name)}.e2e.ts`);

/** Nodes whose scenarios a person could play through in the app: its flows and the root. */
export const observable = (n: AilNode) => n.scenarios.length > 0 && (n.kind === "flow" || n.kind === "system");

export interface AdoptResult { node: string; file: string | null; status: "pass" | "fail" | "stale" | "missing"; detail: string }

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

/** Start the app as `spec` says and wait until it is ready. The returned stop() ends it and everything it started. */
export async function startApp(p: Project, spec: RunSpec, log: (s: string) => void = () => {}): Promise<{ stop: () => void }> {
  const cwd = resolve(p.root, spec.cwd ?? ".");
  let child: ReturnType<typeof spawn> | null = null;
  let output = "";
  if (spec.start) {
    log(`starting the app: ${spec.start}`);
    // Its own process group, so stopping it also stops what it started (a dev server, a simulator bridge).
    child = spawn("sh", ["-c", spec.start], { cwd, detached: true, stdio: ["ignore", "pipe", "pipe"] });
    const keep = (d: Buffer) => { output = (output + d.toString()).slice(-4000); };
    child.stdout?.on("data", keep);
    child.stderr?.on("data", keep);
  }
  const stop = () => { if (child?.pid) try { process.kill(-child.pid, "SIGTERM"); } catch { /* already gone */ } };
  if (spec.ready) {
    const until = Date.now() + (spec.timeout ?? 120) * 1000;
    while (!(await isReady(spec.ready, cwd))) {
      if (child && child.exitCode !== null) { stop(); throw new Error(`the app exited (${child.exitCode}) before it was ready:\n${output.trim().split("\n").slice(-10).join("\n")}`); }
      if (Date.now() > until) { stop(); throw new Error(`the app was not ready after ${spec.timeout ?? 120}s (waiting for ${spec.ready})${output ? `:\n${output.trim().split("\n").slice(-10).join("\n")}` : ""}`); }
      await sleep(500);
    }
  }
  return { stop };
}

export interface AdoptReport { ok: boolean; app: string; results: AdoptResult[]; error?: string }

/**
 * Start the app named in run (or the one already running), run every
 * end-to-end check (or those of `names`) against it, and stop it. A check
 * without a pin is pinned to the node's current spec on its first run; one
 * pinned to an older spec is reported stale and not run.
 */
export async function adopt(p: Project, opts: { app?: string; names?: string[]; log?: (s: string) => void } = {}): Promise<AdoptReport> {
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
  if (!toRun.length) return { ok: results.every((r) => r.status === "missing"), app: label, results };
  if (!spec) return { ok: false, app: label, results, error: "there is no run.legacy or run.app in ail.config.json saying how to start the app; find out how (its README, scripts, CI config, build files) and add it" };
  let app: { stop: () => void };
  try { app = await startApp(p, spec, opts.log); }
  catch (e) { return { ok: false, app: label, results, error: (e as Error).message }; }
  try {
    for (const { n, abs, file } of toRun) {
      // Run from outside the project, so its test setup (a simulated DOM) stays out of a real app's way.
      const r = runBunTest(tmpdir(), [abs], spec.env ?? {});
      results.push(r.ok
        ? { node: n.name, file, status: "pass", detail: `${r.passes} scenario(s) behave as specified` }
        : { node: n.name, file, status: "fail", detail: `${r.failures.length ? r.failures.join("; ") : "the check did not run"}\n${errorExcerpt(r.output, 20)}` });
    }
  } finally { app.stop(); }
  return { ok: results.every((r) => r.status === "pass" || r.status === "missing"), app: label, results };
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
  return lines.join("\n");
}
