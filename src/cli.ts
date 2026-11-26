#!/usr/bin/env bun
// ail — the Agentic Intermediate Language toolchain.
import { adopt, formatAdopt } from "./adopt.ts";
import { build } from "./build.ts";
import { getProvider, modelUnavailable, resolveModels } from "./providers/index.ts";
import { AGENTS, agentOf, postHook, preHook, respond, type Agent } from "./hooks.ts";
import { changedNodes } from "./lens.ts";
import { loadProject, type Project } from "./project.ts";
import { changedScreens, renderShots, takeShots, type Shot } from "./shots.ts";
import { readReport, renderChecks, writeReport } from "./report.ts";
import { writeFileSync } from "node:fs";
import { defaultBase, show } from "./show.ts";

const HELP = `ail — write the spec, let agents build the code.

  ail build [Node…]     Compile whatever changed, then check everything: the spec is
                        sound, the code is built from it, every check passes, a model
                        has compared each screen with its look, and the app, started
                        as run.app says, behaves as the spec says end to end. A check
                        that can't run fails the build. With nothing to compile it
                        only checks, so CI runs it too. Without ANTHROPIC_API_KEY it uses the
                        login of Claude Code, the Cursor CLI or the Copilot CLI, whichever is
                        installed (a Claude, Cursor or Copilot subscription works).
                        --model M     claude-code[:model], cursor[:model], copilot[:model],
                                      anthropic:<id>, openai:<id>, command:<cli>
                        --force       rebuild even if nothing changed
                        --jobs N      nodes compiled at once (default 4)
                        --no-look     don't have a model compare screens with their look
                        --shots DIR   also screenshot the final screen of every scenario of
                                      nodes with a look (needs Playwright)
                        --samples N   also compile N times per model and compare behaviour
                        --since REF   run only the checks of nodes that what changed since
                                      REF affects (and what uses them); the spec and
                                      the build are still checked in full
                        --report FILE write every check's results, test by test, as JSON
  ail adopt [Node…]     Does the app behave as the spec says? Starts it as ail.config.json's
                        run says (run.legacy while you write the spec of an existing app,
                        else run.app), runs each flow's end-to-end check, and stops it.
                        --app NAME    another entry of run
  ail show [what]       The tree (default), a <Node>, changes [--since <ref>], or checks:
                        the last build's checks as a section for a pull request's
                        description, each test with ✅ or ❌ and its screen
                        --shots DIR   add screenshots of the node shown, or for changes,
                                      of the changed nodes and the nodes that use them
                        --report FILE --checks OUT   also write the checks of a build's
                                      --report to OUT as Markdown, one collapsible section
                                      per check, with each test's screen

Run it anywhere inside a project that has an ail.config.json.
For the agent plugins (Claude Code, Cursor, GitHub Copilot):
  ail mcp, ail hook pre|post [--for claude|cursor|copilot].`;

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
    const kind = rest[0];
    if (kind !== "pre" && kind !== "post") throw new Error("usage: ail hook pre|post [--for claude|cursor|copilot]");
    const agent = (flag(a, "for") ?? agentOf(payload)) as Agent;
    if (!AGENTS.includes(agent)) throw new Error(`unknown agent "${agent}" (use ${AGENTS.join(", ")})`);
    const out = respond(kind, kind === "pre" ? preHook(payload) : postHook(payload), agent);
    if (out.stdout) console.log(out.stdout);
    if (out.stderr) console.error(out.stderr);
    return out.exit;
  }
  if (cmd === "mcp") { await import("./mcp.ts").then((m) => m.serve(flag(a, "root"))); return 0; }

  const p = loadProject(flag(a, "root"));
  const log = (m: string) => console.error(`· ${m}`);

  switch (cmd) {
    case "build": {
      const r = await build(p, {
        names: nodesOrDie(p, rest), models: a.flags.model, force: flag(a, "force") === "true",
        jobs: Number(flag(a, "jobs") ?? 4), look: flag(a, "no-look") !== "true",
        temperature: flag(a, "temperature") ? Number(flag(a, "temperature")) : undefined,
        samples: Number(flag(a, "samples") ?? 0), shots: flag(a, "shots"), since: flag(a, "since"), log,
      });
      const report = flag(a, "report");
      if (report) writeReport(report, { ok: r.ok, check: r.check, e2e: r.e2e ?? null, text: r.text });
      print(r.text, { outcomes: r.outcomes, check: r.check });
      return r.ok ? 0 : 1;
    }

    case "adopt": {
      const spec = resolveModels(a.flags.model ?? [], p.config.models)[0]!;
      const r = await adopt(p, { app: flag(a, "app"), names: nodesOrDie(p, rest), log, suggestReview: true, record: true, judge: modelUnavailable(spec) ? undefined : getProvider(spec) });
      print(formatAdopt(r), r);
      return r.ok ? 0 : 1;
    }

    case "show": {
      const target = rest[0] ?? "";
      const since = flag(a, "since") ?? defaultBase(p);
      let text = show(p, target, { since });
      const dir = flag(a, "shots");
      let shots: Shot[] = [];
      if (dir) {
        const names = target === "changes" ? (() => { const c = changedNodes(p, since); return changedScreens(p, [...c.changed, ...c.added]); })()
          : p.nodes.has(target) ? [target] : undefined;
        if (!names || names.length) text += renderShots(shots = await takeShots(p, dir, names, (m) => console.error(m)), dir, flag(a, "shots-url"));
      }
      // The build's checks, one section each, with the screens just taken (else the committed ones).
      const report = flag(a, "report"), checksOut = flag(a, "checks");
      if (report && checksOut) writeFileSync(checksOut, renderChecks(p, readReport(report), { shots, outDir: dir, base: flag(a, "shots-url") }));
      process.stdout.write(text);
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
