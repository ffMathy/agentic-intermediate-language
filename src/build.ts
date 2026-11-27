// `ail build`, shared by the CLI and the plugin's MCP server: compile what
// changed (when a model is available), then check everything. With nothing to
// compile it only checks, without a model.
import { formatCheck, runCheck, type CheckReport } from "./check.ts";
import { checkBuildErrors, checksToDerive, compile, derive, mapLimit, writeGlue, type CompileOutcome } from "./compile.ts";
import { diverge, formatDiverge } from "./diverge.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { plan } from "./plan.ts";
import { isCompilable, type Project } from "./project.ts";
import { getProvider, modelUnavailable, resolveModels } from "./providers/index.ts";
import { clearShots, handBuilt, nodeShotsDir, readShotsIndex, relocateShots, orphanShots, refreshNodeShots, staleShots, takeShots, visualNodes } from "./shots.ts";
import { judgeShots, recordLook, unjudged } from "./look.ts";
import type { Provider } from "./providers/index.ts";
import type { AilNode } from "./parse.ts";
import { join } from "node:path";
import { adopt, e2eCheckPath, formatAdopt, formatReview, reviewAttributes, type AdoptReport } from "./adopt.ts";
import { readLock } from "./lock.ts";
import { checksDir, checkPath, derivedCheckFile, foreignChecks, needsHandCheck, verifyNode } from "./verify.ts";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { buildHead, lastReportPath, writeReport } from "./report.ts";
import { affectedNodes, formatAffected } from "./affected.ts";

export interface BuildOptions {
  /** Only these nodes (default: all). */
  names?: string[];
  /** Model specs; the first compiles (default: the config's, then the environment's). */
  models?: string[];
  force?: boolean;
  jobs?: number;
  /** Have a model compare screens with their look (default true). */
  look?: boolean;
  temperature?: number;
  /** Also compile N times per model and compare behaviour. */
  samples?: number;
  /** Run only the checks of nodes that what changed since this git ref affects (the spec is still checked in full). */
  since?: string;
  /** Also write screenshots of the proofs here. */
  shots?: string;
  log?: (msg: string) => void;
}

export interface BuildResult { ok: boolean; text: string; outcomes: CompileOutcome[]; check: CheckReport | null; stopped: boolean; e2e?: AdoptReport }

export async function build(p: Project, o: BuildOptions = {}): Promise<BuildResult> {
  const log = o.log ?? (() => {});
  const names = o.names ?? [];
  // The commit this build runs on, before it writes anything of its own.
  const head = buildHead(p);
  const errors = lint(p).filter((d) => d.severity === "error");
  if (errors.length) return { ok: false, text: formatDiagnostics(errors) + "\n\nfix the spec before building", outcomes: [], check: null, stopped: false };
  const jobs = o.jobs ?? 4;
  if (!Number.isInteger(jobs) || jobs < 1) throw new Error(`--jobs must be a whole number of at least 1, got "${jobs}"`);
  // Screenshots still in checks/shots/ move beside the spec first, so anything retaken below replaces them.
  if (relocateShots(p)) log("proof screenshots moved to their place beside each spec file");
  // A project's first build is the moment to set up review of what it generates.
  const firstBuild = Object.keys(readLock(p).nodes).length === 0;
  const specs = resolveModels(o.models ?? [], p.config.models);
  const noModel = modelUnavailable(specs[0]!);
  const targets = p.ordered.filter((n) => isCompilable(p, n) && (!names.length || names.includes(n.name)));
  const stale = plan(p).filter((e) => (o.force || e.status !== "fresh") && targets.some((t) => t.name === e.node));
  // A target that checks in its own language derives each check as its node is built (CompileOptions.derive).
  const deriveWhileBuilding = !!foreignChecks(p);
  const built = targets.filter((n) => !needsHandCheck(p, n));
  const toDerive = deriveWhileBuilding ? [] : checksToDerive(p, built);
  const pendingChecks = deriveWhileBuilding ? checksToDerive(p, built) : [];
  // Nodes with a look whose code is written by hand: ail builds nothing for them, but derives a check that tests
  // that code and pictures it.
  const hand = p.ordered.filter((n) => needsHandCheck(p, n) && (!names.length || names.includes(n.name)));
  const handToDerive = checksToDerive(p, hand);
  let out: CompileOutcome[] = [];
  if (noModel && (stale.length || toDerive.length || pendingChecks.length || handToDerive.length)) {
    // e.g. in CI: report what is out of date instead of failing on every model call
    log(`${new Set([...stale.map((e) => e.node), ...toDerive.map((n) => n.name), ...pendingChecks.map((n) => n.name), ...handToDerive.map((n) => n.name)]).size} node(s) need building, but there is no model here: ${noModel}. Build where there is one and commit the result.`);
  } else {
    const provider = getProvider(specs[0]!);
    const stopped = new Map<string, string>();
    const failed = new Map<string, string>();
    await mapLimit(toDerive, jobs, async (n) => {
      log(`${n.name}: deriving checks from its scenarios`);
      try {
        const r = await derive(p, n, provider);
        if (r.stop) stopped.set(n.name, r.stop);
        else log(`${n.name}: wrote ${r.file}; review it, since it now defines "correct"`);
      } catch (e) {
        failed.set(n.name, `deriving its checks failed: ${(e as Error).message}`);
      }
    });
    // In a language of its own, every check of a kind usually lives in one test project: deriving them side by side
    // would build it at once, and a check that doesn't build yet would fail the others'. So one at a time.
    await mapLimit(handToDerive, foreignChecks(p) ? 1 : jobs, async (n) => {
      const r = await deriveHandCheck(p, n, provider, log);
      if (r.stop) stopped.set(n.name, r.stop);
      else if (r.failed) failed.set(n.name, r.failed);
    });
    out = await compile(p, targets.filter((n) => !needsHandCheck(p, n) && !stopped.has(n.name) && !failed.has(n.name)).map((n) => n.name), {
      provider, jobs, force: o.force, log, look: !noModel && o.look !== false, temperature: o.temperature, derive: deriveWhileBuilding,
    });
    for (const [node, q] of stopped) out.push({ node, status: "stopped", attempts: 0, detail: q });
    for (const [node, why] of failed) out.push({ node, status: "failed", attempts: 0, detail: why });
    // The proof screenshots of every node built since they were last taken, then the glue that shows them
    // (always: compiling a node with a look retakes its screenshots too, and the spec module imports them).
    await refreshShots(p, log);
    for (const g of writeGlue(p)) log(`glue: wrote ${g}`);
    // A node built by hand can't be rebuilt when its screens don't match its look: that is a failure to report.
    if (o.look !== false) for (const r of await judgeHandLooks(p, hand.filter((n) => !failed.has(n.name) && !stopped.has(n.name)), provider, log)) out.push(r);
  }

  // Then the check: spec, build, behaviour, and anything asked for on top.
  const affected = o.since ? affectedNodes(p, o.since) : undefined;
  const scope = affected && (names.length ? affected.nodes.filter((n) => names.includes(n)) : affected.nodes);
  const report = runCheck(p, names, { scope });
  let ok = report.ok && out.every((x) => x.status === "fresh" || x.status === "compiled");
  const icon = { fresh: "✓", compiled: "✓", stopped: "?", failed: "✗", skipped: "…" };
  const sections = [
    out.filter((x) => x.status !== "fresh").map((x) => `${icon[x.status]} ${x.node.padEnd(18)} ${x.status}${x.status === "stopped" || x.status === "skipped" || x.status === "failed" ? `: ${x.detail}` : ""}`).join("\n"),
    [affected && formatAffected(affected), formatCheck(report)].filter(Boolean).join("\n"),
  ];
  if (o.samples && o.samples > 0) {
    const reports = [];
    for (const n of targets) reports.push(await diverge(p, n, specs.map(getProvider), o.samples, 1, log));
    ok &&= reports.every((r) => r.verdict === "converged");
    sections.push(formatDiverge(reports));
  }
  // The end-to-end checks, against the app this build made, started as run.app says.
  let e2e: AdoptReport | undefined;
  if (p.ordered.some((n) => existsSync(e2eCheckPath(p, n))) && (!scope || scope.length)) {
    if (p.config.run?.app) {
      const r = e2e = await adopt(p, { app: "app", names: scope ?? names, log });
      ok &&= r.ok;
      sections.push(formatAdopt(r));
    } else {
      // A build proves the app behaves as its spec says; checks that can't run prove nothing, so the build fails.
      ok = false;
      sections.push("✗ app      end-to-end checks could not run: ail.config.json has no run.app saying how to start the app this project builds. Add it (for an adopted app, the same as run.legacy) and build again");
    }
  }
  if (o.shots) sections.push(`📷 ${(await takeShots(p, o.shots, names.length ? names : undefined, log)).length} screenshot(s) in ${o.shots}`);
  if (firstBuild) { const tip = formatReview(reviewAttributes(p)); if (tip) sections.push(tip.trimStart()); }
  const stopped = out.some((x) => x.status === "stopped");
  if (stopped) sections.push("The spec doesn't decide the questions above. Answer them in the .ail.md files, then build again.");
  const text = sections.filter(Boolean).join("\n\n");
  // Saved for `ail show checks`, which puts them in a pull request's description.
  writeReport(lastReportPath(p), { ok, check: report, e2e: e2e ?? null, text, affected, ...head });
  return { ok, text, outcomes: out, check: report, stopped, e2e };
}

/**
 * Derive the check of a node built by hand, and make sure it builds: a check that doesn't is derived again with
 * its build errors, and taken back if it still doesn't (in a language with one test project, it would break every
 * other check). A check that builds but fails stays: the check reports it.
 */
async function deriveHandCheck(p: Project, n: AilNode, provider: Provider, log: (s: string) => void): Promise<{ stop?: string; failed?: string }> {
  const rel = checkPath(p, n), abs = join(p.root, rel);
  const before = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  log(`${n.name}: deriving the check that tests and pictures its hand-written code`);
  let retry: { errors: string; previous: string } | undefined;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await derive(p, n, provider, retry);
      if (r.stop) return { stop: r.stop };
    } catch (e) {
      return { failed: `deriving its check failed: ${(e as Error).message}` };
    }
    const v = verifyNode(p, n);
    const output = v.checks.filter((c) => !c.ok).map((c) => c.detail).join("\n");
    const errors = v.ok ? null : checkBuildErrors(output, rel, abs);
    if (!errors) {
      log(`${n.name}: wrote ${rel}; review it, since it now defines "correct"${v.ok ? "" : " (it fails: see the check below)"}`);
      return {};
    }
    log(`${n.name}: its check ${rel} does not build; deriving it again`);
    retry = { errors, previous: readFileSync(abs, "utf8") };
  }
  if (before === null) rmSync(abs, { force: true }); else writeFileSync(abs, before);
  return { failed: `its derived check ${rel} did not build after 3 attempts, so it was taken back:\n${retry!.errors}` };
}

/** Have a model compare the committed screens of nodes built by hand with their look, where not done for their current check. */
async function judgeHandLooks(p: Project, nodes: AilNode[], provider: Provider, log: (s: string) => void): Promise<CompileOutcome[]> {
  const out: CompileOutcome[] = [];
  const todo = new Set(unjudged(p));
  for (const n of nodes.filter((x) => todo.has(x.name) && handBuilt(p, x) && derivedCheckFile(p, x).file)) {
    const shots = readShotsIndex(nodeShotsDir(p, n))?.shots.map((s) => ({ node: n.name, ...s })) ?? [];
    if (!shots.length) { log(`${n.name}: screens not compared: its check saved none`); continue; }
    log(`${n.name}: comparing its screens with its look`);
    try {
      const r = await judgeShots(p, n, shots, provider, log, true);
      if (r.ok) { recordLook(p, n.name); log(`${n.name}: ${shots.length} screen(s) match its look`); }
      else out.push({ node: n.name, status: "failed", attempts: 0, detail: `its code is written by hand, and its screens don't match its look:\n${r.problems.map((x) => `    - ${x}`).join("\n")}` });
    } catch (e) {
      log(`${n.name}: screens not compared: ${(e as Error).message}`);
    }
  }
  return out;
}

/** Retake the committed screenshots that are out of date and remove orphaned ones. True when anything changed. */
async function refreshShots(p: Project, log: (s: string) => void): Promise<boolean> {
  let changed = relocateShots(p);
  for (const dir of orphanShots(p)) { clearShots(dir); changed = true; }
  // Screens of nodes built by hand are retaken every build: the app's own code can change them without changing the
  // spec or the check. Their look is compared again only when they did change (look.ts, lookKey).
  const retake = [...staleShots(p), ...visualNodes(p).filter((n) => handBuilt(p, n))];
  for (const n of [...new Set(retake)]) {
    try {
      await refreshNodeShots(p, n);
      log(`${n.name}: proof screenshots taken`);
      changed = true;
    } catch (e) {
      const why = (e as Error).message;
      log(`${n.name}: proof screenshots not taken: ${why}`);
      // Without a browser, none can be taken; a check that failed only keeps its own node's from being taken.
      if (why.startsWith("screenshots need Playwright")) break;
    }
  }
  return changed;
}
