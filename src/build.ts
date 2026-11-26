// `ail build`, shared by the CLI and the plugin's MCP server: compile what
// changed (when a model is available), then check everything. With nothing to
// compile it only checks, without a model.
import { formatCheck, runCheck, type CheckReport } from "./check.ts";
import { checksToDerive, compile, derive, mapLimit, writeGlue, type CompileOutcome } from "./compile.ts";
import { diverge, formatDiverge } from "./diverge.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { plan } from "./plan.ts";
import { isCompilable, type Project } from "./project.ts";
import { getProvider, modelUnavailable, resolveModels } from "./providers/index.ts";
import { orphanShots, refreshNodeShots, staleShots, takeShots } from "./shots.ts";
import { rmSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { adopt, formatAdopt, formatReview, reviewAttributes } from "./adopt.ts";
import { readLock } from "./lock.ts";
import { checksDir, foreignChecks } from "./verify.ts";

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
  /** Also write screenshots of the proofs here. */
  shots?: string;
  log?: (msg: string) => void;
}

export interface BuildResult { ok: boolean; text: string; outcomes: CompileOutcome[]; check: CheckReport | null; stopped: boolean }

export async function build(p: Project, o: BuildOptions = {}): Promise<BuildResult> {
  const log = o.log ?? (() => {});
  const names = o.names ?? [];
  const errors = lint(p).filter((d) => d.severity === "error");
  if (errors.length) return { ok: false, text: formatDiagnostics(errors) + "\n\nfix the spec before building", outcomes: [], check: null, stopped: false };
  const jobs = o.jobs ?? 4;
  if (!Number.isInteger(jobs) || jobs < 1) throw new Error(`--jobs must be a whole number of at least 1, got "${jobs}"`);
  // A project's first build is the moment to set up review of what it generates.
  const firstBuild = Object.keys(readLock(p).nodes).length === 0;
  const specs = resolveModels(o.models ?? [], p.config.models);
  const noModel = modelUnavailable(specs[0]!);
  const targets = p.ordered.filter((n) => isCompilable(p, n) && (!names.length || names.includes(n.name)));
  const stale = plan(p).filter((e) => (o.force || e.status !== "fresh") && targets.some((t) => t.name === e.node));
  // A target that checks in its own language derives each check as its node is built (CompileOptions.derive).
  const deriveWhileBuilding = !!foreignChecks(p);
  const toDerive = deriveWhileBuilding ? [] : checksToDerive(p, targets);
  const pendingChecks = deriveWhileBuilding ? checksToDerive(p, targets) : [];
  let out: CompileOutcome[] = [];
  if (noModel && (stale.length || toDerive.length || pendingChecks.length)) {
    // e.g. in CI: report what is out of date instead of failing on every model call
    log(`${new Set([...stale.map((e) => e.node), ...toDerive.map((n) => n.name), ...pendingChecks.map((n) => n.name)]).size} node(s) need building, but there is no model here: ${noModel}. Build where there is one and commit the result.`);
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
    out = await compile(p, targets.filter((n) => !stopped.has(n.name) && !failed.has(n.name)).map((n) => n.name), {
      provider, jobs, force: o.force, log, look: !noModel && o.look !== false, temperature: o.temperature, derive: deriveWhileBuilding,
    });
    for (const [node, q] of stopped) out.push({ node, status: "stopped", attempts: 0, detail: q });
    for (const [node, why] of failed) out.push({ node, status: "failed", attempts: 0, detail: why });
    // The proof screenshots of every node built since they were last taken, then the glue that shows them.
    if (await refreshShots(p, log)) writeGlue(p);
  }

  // Then the check: spec, build, behaviour, and anything asked for on top.
  const report = runCheck(p, names);
  let ok = report.ok && out.every((x) => x.status === "fresh" || x.status === "compiled");
  const icon = { fresh: "✓", compiled: "✓", stopped: "?", failed: "✗", skipped: "…" };
  const sections = [
    out.filter((x) => x.status !== "fresh").map((x) => `${icon[x.status]} ${x.node.padEnd(18)} ${x.status}${x.status === "stopped" || x.status === "skipped" || x.status === "failed" ? `: ${x.detail}` : ""}`).join("\n"),
    formatCheck(report),
  ];
  if (o.samples && o.samples > 0) {
    const reports = [];
    for (const n of targets) reports.push(await diverge(p, n, specs.map(getProvider), o.samples, 1, log));
    ok &&= reports.every((r) => r.verdict === "converged");
    sections.push(formatDiverge(reports));
  }
  // The end-to-end checks, against the app this build made, started as run.app says.
  if (existsSync(join(checksDir(p), "e2e"))) {
    if (p.config.run?.app) {
      const r = await adopt(p, { app: "app", names, log, judge: noModel || o.look === false ? undefined : getProvider(specs[0]!) });
      ok &&= r.ok;
      sections.push(formatAdopt(r));
    } else sections.push("! app      end-to-end checks not run: ail.config.json has no run.app saying how to start the app this project builds");
  }
  if (o.shots) sections.push(`📷 ${(await takeShots(p, o.shots, names.length ? names : undefined, log)).length} screenshot(s) in ${o.shots}`);
  if (firstBuild) { const tip = formatReview(reviewAttributes(p)); if (tip) sections.push(tip.trimStart()); }
  const stopped = out.some((x) => x.status === "stopped");
  if (stopped) sections.push("The spec doesn't decide the questions above. Answer them in the .ail.md files, then build again.");
  return { ok, text: sections.filter(Boolean).join("\n\n"), outcomes: out, check: report, stopped };
}

/** Retake the committed screenshots that are out of date and remove orphaned ones. True when anything changed. */
async function refreshShots(p: Project, log: (s: string) => void): Promise<boolean> {
  let changed = false;
  for (const dir of orphanShots(p)) { rmSync(dir, { recursive: true, force: true }); changed = true; }
  for (const n of staleShots(p)) {
    try {
      await refreshNodeShots(p, n);
      log(`${n.name}: proof screenshots taken`);
      changed = true;
    } catch (e) {
      log(`proof screenshots not taken: ${(e as Error).message}`);
      break;
    }
  }
  return changed;
}
