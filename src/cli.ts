#!/usr/bin/env bun
// ail — the Agentic Intermediate Language toolchain.
import { readFileSync, writeFileSync } from "node:fs";
import { compile, derive, prune, submit, writeGlue } from "./compile.ts";
import { buildContext } from "./context.ts";
import { diverge, formatDiverge } from "./diverge.ts";
import { postHook, preHook } from "./hooks.ts";
import { LENSES, changedNodes, renderLens, renderReview, type Lens } from "./lens.ts";
import { lift } from "./lift.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { formatPlan, plan } from "./plan.ts";
import { isCompilable, loadProject, modulePath, type Project } from "./project.ts";
import { getProvider, resolveModels } from "./providers/index.ts";
import { formatVerify, verifyProject } from "./verify.ts";

const HELP = `ail — Agentic Intermediate Language toolchain

usage: ail <command> [args] [--root <dir>] [--json]

  lint                         check structure, traceability and per-level vocabulary
  plan [--check]               show which nodes are fresh, stale, missing or drifted
                               (--check: exit 1 unless everything is fresh)
  context <Node>               print the encapsulated compile context for one node
  verify [Node...]             run every check the IL implies against the code
  compile [Node...]            compile stale nodes (--model, --force, --max-attempts N)
  submit <Node> <file>         hand in code for a node: verified, locked or rolled back
  derive <Node>                derive pinned tests from scenarios/verify (--model)
  diverge [Node...]            sample N× per model and report behavioural disagreement
                               (--samples N, --model M (repeatable), --temperature T)
  lens <${LENSES.join("|")}>
                               render the IL for an audience (--tag T, --changed REF, -o FILE)
  review [--base REF]          semantic IL diff since REF, grouped by reviewer level
  lift <file>                  draft IL from existing code (--name, --kind, --level, --model)
  glue                         regenerate deterministic glue (tokens, entry, catalog)
  prune                        delete output of nodes that left the IL (hand edits are kept)
  hook pre|post                Claude Code hook entry points (payload on stdin)
  mcp                          run the MCP server on stdio

models: claude-code[:<model>] (uses Claude Code's login, e.g. a Claude subscription;
        the default when no ANTHROPIC_API_KEY is set), anthropic:<id>,
        openai:<id>, command:<shell cmd>, mock:<file.json>; or AIL_MODELS=a,b`;

interface Args { _: string[]; flags: Record<string, string[]> }

function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], flags: {} };
  const boolean = new Set(["json", "force", "help", "stdin", "check"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "-o") { (out.flags.o ??= []).push(argv[++i]!); continue; }
    if (a.startsWith("--")) {
      const [k, inline] = a.slice(2).split("=", 2) as [string, string | undefined];
      const v = inline ?? (boolean.has(k) ? "true" : argv[++i]!);
      (out.flags[k] ??= []).push(v);
    } else out._.push(a);
  }
  return out;
}

const flag = (a: Args, k: string) => a.flags[k]?.at(-1);
const num = (a: Args, k: string, d: number) => (flag(a, k) ? Number(flag(a, k)) : d);

function node(p: Project, name: string | undefined) {
  if (!name) throw new Error("missing node name");
  const n = p.nodes.get(name);
  if (!n) throw new Error(`unknown node "${name}". Known: ${[...p.nodes.keys()].join(", ")}`);
  return n;
}

async function main(argv: string[]): Promise<number> {
  const a = parseArgs(argv);
  const [cmd, ...rest] = a._;
  const json = flag(a, "json") === "true";
  const print = (text: string, data?: unknown) => console.log(json && data !== undefined ? JSON.stringify(data, null, 2) : text);
  if (!cmd || cmd === "help" || flag(a, "help")) { console.log(HELP); return 0; }

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
    case "lint": {
      const d = lint(p);
      print(formatDiagnostics(d), d);
      return d.some((x) => x.severity === "error") ? 1 : 0;
    }
    case "plan": {
      const e = plan(p);
      print(formatPlan(e), e);
      return flag(a, "check") === "true" && e.some((x) => x.status !== "fresh") ? 1 : 0;
    }
    case "context": {
      console.log(buildContext(p, node(p, rest[0])));
      return 0;
    }
    case "verify": {
      const r = verifyProject(p, rest);
      print(formatVerify(r), r);
      return r.ok ? 0 : 1;
    }
    case "prune": {
      const r = prune(p);
      print([r.removed.length ? `removed ${r.removed.join(", ")}` : "nothing to prune", ...(r.kept.length ? [`kept hand-edited ${r.kept.join(", ")}`] : [])].join("\n"), r);
      return 0;
    }
    case "glue": {
      const w = writeGlue(p);
      print(w.length ? `wrote ${w.join(", ")}` : "glue up to date", w);
      return 0;
    }
    case "compile": {
      const errors = lint(p).filter((d) => d.severity === "error");
      if (errors.length) { console.error(formatDiagnostics(errors) + "\nfix lint errors before compiling"); return 1; }
      const out = await compile(p, rest, {
        provider: models()[0]!, force: flag(a, "force") === "true", maxAttempts: num(a, "max-attempts", 3),
        temperature: flag(a, "temperature") ? Number(flag(a, "temperature")) : undefined, log,
      });
      const icon = { fresh: "✓", compiled: "✓", stopped: "?", failed: "✗" };
      print(out.map((o) => `${icon[o.status]} ${o.node.padEnd(20)} ${o.status.padEnd(9)} ${o.detail}`).join("\n"), out);
      for (const o of out.filter((x) => x.status === "stopped")) console.error(`\n${o.node} needs a spec decision: ${o.detail}`);
      return out.some((o) => o.status === "failed" || o.status === "stopped") ? 1 : 0;
    }
    case "submit": {
      const n = node(p, rest[0]);
      const path = modulePath(p, n);
      if (!path) throw new Error(`${n.name} has no output path`);
      const body = flag(a, "stdin") === "true" ? await Bun.stdin.text() : readFileSync(rest[1] ?? path, "utf8");
      const r = submit(p, n, { [path]: body }, flag(a, "by") ?? "agent");
      print(r.ok ? `✓ ${n.name} accepted and locked` : `✗ ${n.name} rejected: ${r.error}\n${r.verify ? formatVerify({ results: [r.verify], typecheck: null, ok: false }) : ""}`, r);
      return r.ok ? 0 : 1;
    }
    case "derive": {
      const n = node(p, rest[0]);
      const r = await derive(p, n, models()[0]!);
      if (r.stop) { console.error(`${n.name}: ${r.stop}`); return 1; }
      print(`wrote ${r.file} — review it: it now defines what "correct" means for ${n.name}`, r);
      return 0;
    }
    case "diverge": {
      const targets = (rest.length ? rest.map((r) => node(p, r)) : p.ordered.filter((n) => isCompilable(p, n)));
      const reports = [];
      for (const n of targets) reports.push(await diverge(p, n, models(), num(a, "samples", 3), flag(a, "temperature") ? Number(flag(a, "temperature")) : 1, log));
      print(formatDiverge(reports), reports);
      return reports.every((r) => r.verdict === "converged") ? 0 : 1;
    }
    case "lens": {
      const lens = rest[0] as Lens;
      if (!LENSES.includes(lens)) throw new Error(`lens must be one of ${LENSES.join(", ")}`);
      const ref = flag(a, "changed");
      const only = ref ? (() => { const c = changedNodes(p, ref); return new Set([...c.changed, ...c.added]); })() : undefined;
      const text = renderLens(p, lens, { tag: flag(a, "tag"), only });
      if (flag(a, "o")) writeFileSync(flag(a, "o")!, text); else process.stdout.write(text);
      return 0;
    }
    case "review": {
      process.stdout.write(renderReview(p, flag(a, "base") ?? "HEAD"));
      return 0;
    }
    case "lift": {
      if (!rest[0]) throw new Error("usage: ail lift <file>");
      const r = await lift(p, rest[0], models()[0]!, { name: flag(a, "name"), kind: flag(a, "kind"), level: flag(a, "level") });
      console.log(r.il);
      if (r.errors.length) { console.error(`draft has problems:\n- ${r.errors.join("\n- ")}`); return 1; }
      return 0;
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
