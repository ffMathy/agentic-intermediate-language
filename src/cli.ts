#!/usr/bin/env bun
// ail — the Agentic Intermediate Language toolchain.
import { readFileSync } from "node:fs";
import { formatCheck, runCheck } from "./check.ts";
import { checkPath, checksToDerive, compile, derive, submit } from "./compile.ts";
import { buildContext } from "./context.ts";
import { diverge, formatDiverge } from "./diverge.ts";
import { postHook, preHook } from "./hooks.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { isCompilable, loadProject, modulePath, type Project } from "./project.ts";
import { getProvider, resolveModels } from "./providers/index.ts";
import { show } from "./show.ts";
import { formatVerify } from "./verify.ts";

const HELP = `ail — write the spec, let agents build the code.

  ail check [Node…]     Is the spec sound, is the code built from it, and does it pass?
                        --samples N   also compile N times per model and compare behaviour
  ail build [Node…]     Compile whatever changed. Uses Claude Code's login (a Claude
                        subscription works) unless ANTHROPIC_API_KEY is set.
                        --model M     claude-code[:model], anthropic:<id>, openai:<id>, command:<cli>
                        --force       rebuild even if nothing changed
  ail show [what]       The tree (default), a <Node>, an audience
                        (stakeholder | design | engineer | specialist [tag]),
                        or changes [--since <ref>]

Run it anywhere inside a project that has an ail.config.json.
For agents and tooling: ail context <Node>, ail submit <Node> <file> [--checks <file>], ail mcp, ail hook pre|post.`;

interface Args { _: string[]; flags: Record<string, string[]> }

function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], flags: {} };
  const boolean = new Set(["json", "force", "help"]);
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
    case "check": {
      const names = nodesOrDie(p, rest);
      const report = runCheck(p, names);
      let ok = report.ok;
      let text = formatCheck(report);
      const samples = Number(flag(a, "samples") ?? 0);
      if (samples > 0) {
        const targets = (names.length ? names.map((n) => p.nodes.get(n)!) : p.ordered).filter((n) => isCompilable(p, n));
        const reports = [];
        for (const n of targets) reports.push(await diverge(p, n, models(), samples, 1, log));
        ok &&= reports.every((r) => r.verdict === "converged");
        text += `\n\n${formatDiverge(reports)}`;
      }
      print(text, report);
      return ok ? 0 : 1;
    }

    case "build": {
      const errors = lint(p).filter((d) => d.severity === "error");
      if (errors.length) { console.error(formatDiagnostics(errors) + "\n\nfix the spec before building"); return 1; }
      const provider = models()[0]!;
      const names = nodesOrDie(p, rest);
      const targets = p.ordered.filter((n) => isCompilable(p, n) && (!names.length || names.includes(n.name)));
      const stopped = new Map<string, string>();
      for (const n of checksToDerive(p, targets)) {
        log(`${n.name}: deriving checks from its scenarios`);
        const r = await derive(p, n, provider);
        if (r.stop) stopped.set(n.name, r.stop);
        else log(`${n.name}: wrote ${r.file}; review it, since it now defines "correct"`);
      }
      const out = await compile(p, targets.filter((n) => !stopped.has(n.name)).map((n) => n.name), {
        provider, force: flag(a, "force") === "true", log,
        temperature: flag(a, "temperature") ? Number(flag(a, "temperature")) : undefined,
      });
      for (const [node, q] of stopped) out.push({ node, status: "stopped", attempts: 0, detail: q });
      const icon = { fresh: "✓", compiled: "✓", stopped: "?", failed: "✗" };
      print(out.map((o) => `${icon[o.status]} ${o.node.padEnd(18)} ${o.status === "fresh" ? "up to date" : o.status}${o.status === "stopped" ? `: ${o.detail}` : ""}`).join("\n"), out);
      if (out.some((o) => o.status === "stopped")) console.error("\nThe spec doesn't decide the questions above. Answer them in the .ail.md files, then build again.");
      return out.some((o) => o.status === "failed" || o.status === "stopped") ? 1 : 0;
    }

    case "show": {
      const target = rest[0] ?? "";
      process.stdout.write(show(p, target, { tag: rest[1], since: flag(a, "since") }));
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
