#!/usr/bin/env bun
// ail — the Agentic Intermediate Language toolchain.
import { readFileSync } from "node:fs";
import { formatCheck, runCheck } from "./check.ts";
import { checkPath, checksToDerive, compile, derive, mapLimit, submit, type CompileOutcome } from "./compile.ts";
import { buildContext } from "./context.ts";
import { diverge, formatDiverge } from "./diverge.ts";
import { postHook, preHook } from "./hooks.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { isCompilable, loadProject, modulePath, type Project } from "./project.ts";
import { getProvider, modelUnavailable, resolveModels } from "./providers/index.ts";
import { changedNodes } from "./lens.ts";
import { changedScreens, renderShots, takeShots } from "./shots.ts";
import { plan } from "./plan.ts";
import { defaultBase, show } from "./show.ts";
import { formatVerify } from "./verify.ts";

const HELP = `ail — write the spec, let agents build the code.

  ail build [Node…]     Compile whatever changed, then check everything: the spec is
                        sound, the code is built from it, every check passes, and a model
                        has compared each screen with its look. With nothing to compile it
                        only checks, so CI runs it too. Uses Claude Code's login (a Claude
                        subscription works) unless ANTHROPIC_API_KEY is set.
                        --model M     claude-code[:model], anthropic:<id>, openai:<id>, command:<cli>
                        --force       rebuild even if nothing changed
                        --jobs N      nodes compiled at once (default 4)
                        --no-look     don't have a model compare screens with their look
                        --shots DIR   also screenshot the final screen of every scenario of
                                      nodes with a look (needs Playwright)
                        --samples N   also compile N times per model and compare behaviour
  ail show [what]       The tree (default), a <Node>, an audience
                        (stakeholder | design | engineer | specialist [tag]),
                        or changes [--since <ref>]
                        --shots DIR   add screenshots of the node shown, or for changes,
                                      of the changed nodes and the nodes that use them

Run it anywhere inside a project that has an ail.config.json.
For agents and tooling: ail context <Node>, ail submit <Node> <file> [--checks <file>], ail mcp, ail hook pre|post.`;

interface Args { _: string[]; flags: Record<string, string[]> }

function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], flags: {} };
  const boolean = new Set(["json", "force", "help", "no-look"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "-h") { out.flags.help = ["true"]; continue; }
    if (a.startsWith("--")) {
      const [k, inline] = a.slice(2).split("=", 2) as [string, string | undefined];
      (out.flags[k] ??= []).push(inline ?? (boolean.has(k) ? "true" : argv[++i]!));
    } else out._.push(a);
  }
  return out;
}

const flag = (a: Args, k: string) => a.flags[k]?.at(-1);

function nodesOrDie(p: Project, names: string[]) {
  for (const n of names) if (!p.nodes.has(n)) throw new Error(`unknown node "${n}". Known: ${[...p.nodes.keys()].join(", ")}`);
  return names;
}

async function main(argv: string[]): Promise<number> {
  const a = parseArgs(argv);
  const [cmd, ...rest] = a._;
  const json = flag(a, "json") === "true";
  const print = (text: string, data: unknown) => console.log(json ? JSON.stringify(data, null, 2) : text);
  if (!cmd || cmd === "help" || flag(a, "help")) { console.log(HELP); return 0; }

  // plumbing that must not load a project eagerly
  if (cmd === "hook") {
    const payload = JSON.parse((await Bun.stdin.text()) || "{}");
    const r = rest[0] === "pre" ? preHook(payload) : rest[0] === "post" ? postHook(payload) : null;
    if (!r) throw new Error("usage: ail hook pre|post");
    if (r.message) console.error(r.message);
    return r.code;
  }
  if (cmd === "mcp") { await import("./mcp.ts").then((m) => m.serve(flag(a, "root"))); return 0; }

  const p = loadProject(flag(a, "root"));
  const models = () => resolveModels(a.flags.model ?? [], p.config.models).map(getProvider);
  const log = (m: string) => console.error(`· ${m}`);

  switch (cmd) {
    case "build": {
      const errors = lint(p).filter((d) => d.severity === "error");
      if (errors.length) { console.error(formatDiagnostics(errors) + "\n\nfix the spec before building"); return 1; }
      const names = nodesOrDie(p, rest);
      const jobs = Number(flag(a, "jobs") ?? 4);
      if (!Number.isInteger(jobs) || jobs < 1) throw new Error(`--jobs must be a whole number of at least 1, got "${flag(a, "jobs")}"`);
      const force = flag(a, "force") === "true";
      const spec = resolveModels(a.flags.model ?? [], p.config.models)[0]!;
      const noModel = modelUnavailable(spec);
      const targets = p.ordered.filter((n) => isCompilable(p, n) && (!names.length || names.includes(n.name)));
      const stale = plan(p).filter((e) => (force || e.status !== "fresh") && targets.some((t) => t.name === e.node));
      const toDerive = checksToDerive(p, targets);
      let out: CompileOutcome[] = [];
      if (noModel && (stale.length || toDerive.length)) {
        // e.g. in CI: report what is out of date instead of failing on every model call
        log(`${[...new Set([...stale.map((e) => e.node), ...toDerive.map((n) => n.name)])].length} node(s) need building, but there is no model here: ${noModel}. Build where there is one and commit the result.`);
      } else {
        const provider = getProvider(spec);
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
          provider, jobs, force, log, look: !noModel && flag(a, "no-look") !== "true",
          temperature: flag(a, "temperature") ? Number(flag(a, "temperature")) : undefined,
        });
        for (const [node, q] of stopped) out.push({ node, status: "stopped", attempts: 0, detail: q });
        for (const [node, why] of failed) out.push({ node, status: "failed", attempts: 0, detail: why });
      }
      // Then the check: spec, build, behaviour, and anything asked for on top.
      const report = runCheck(p, names);
      const built = out.every((o) => o.status === "fresh" || o.status === "compiled");
      let ok = report.ok && built;
      const icon = { fresh: "✓", compiled: "✓", stopped: "?", failed: "✗", skipped: "…" };
      const sections = [
        out.filter((o) => o.status !== "fresh").map((o) => `${icon[o.status]} ${o.node.padEnd(18)} ${o.status}${o.status === "stopped" || o.status === "skipped" || o.status === "failed" ? `: ${o.detail}` : ""}`).join("\n"),
        formatCheck(report),
      ];
      const samples = Number(flag(a, "samples") ?? 0);
      if (samples > 0) {
        const reports = [];
        for (const n of targets) reports.push(await diverge(p, n, models(), samples, 1, log));
        ok &&= reports.every((r) => r.verdict === "converged");
        sections.push(formatDiverge(reports));
      }
      const dir = flag(a, "shots");
      if (dir) sections.push(`📷 ${(await takeShots(p, dir, names.length ? names : undefined, (m) => console.error(m))).length} screenshot(s) in ${dir}`);
      print(sections.filter(Boolean).join("\n\n"), { outcomes: out, check: report });
      if (out.some((o) => o.status === "stopped")) console.error("\nThe spec doesn't decide the questions above. Answer them in the .ail.md files, then build again.");
      return ok ? 0 : 1;
    }

    case "show": {
      const target = rest[0] ?? "";
      const since = flag(a, "since") ?? defaultBase(p);
      let text = show(p, target, { tag: rest[1], since });
      const dir = flag(a, "shots");
      if (dir) {
        const names = target === "changes" ? (() => { const c = changedNodes(p, since); return changedScreens(p, [...c.changed, ...c.added]); })()
          : p.nodes.has(target) ? [target] : undefined;
        if (!names || names.length) text += renderShots(await takeShots(p, dir, names, (m) => console.error(m)), dir, flag(a, "shots-url"));
      }
      process.stdout.write(text);
      return 0;
    }

    // --- plumbing for agents and tooling -------------------------------------
    case "context": {
      const [name] = nodesOrDie(p, rest.slice(0, 1));
      if (!name) throw new Error("usage: ail context <Node>");
      process.stdout.write(buildContext(p, p.nodes.get(name)!));
      return 0;
    }
    case "submit": {
      const [name] = nodesOrDie(p, rest.slice(0, 1));
      if (!name || !rest[1]) throw new Error("usage: ail submit <Node> <file> [--checks <file>]");
      const n = p.nodes.get(name)!;
      const path = modulePath(p, n);
      if (!path) throw new Error(`${n.name} has no output path`);
      const files: Record<string, string> = { [path]: readFileSync(rest[1], "utf8") };
      if (flag(a, "checks")) files[checkPath(p, n)] = readFileSync(flag(a, "checks")!, "utf8");
      const r = submit(p, n, files, flag(a, "by") ?? "agent");
      print(r.ok ? `✓ ${n.name} accepted` : `✗ ${n.name} rejected: ${r.error}\n${r.verify ? formatVerify({ results: [r.verify], typecheck: null, ok: false }) : ""}`, r);
      return r.ok ? 0 : 1;
    }
    default:
      console.error(`unknown command "${cmd}"\n\n${HELP}`);
      return 1;
  }
}

if (import.meta.main) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(`ail: ${(e as Error).message}`); process.exit(1); });
}

export { main };
