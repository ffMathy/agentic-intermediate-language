#!/usr/bin/env bun
// ail — the Agentic Intermediate Language toolchain.
import { adopt, formatAdopt } from "./adopt.ts";
import { build } from "./build.ts";
import { postHook, preHook } from "./hooks.ts";
import { changedNodes } from "./lens.ts";
import { loadProject, type Project } from "./project.ts";
import { changedScreens, renderShots, takeShots } from "./shots.ts";
import { defaultBase, show } from "./show.ts";

const HELP = `ail — write the spec, let agents build the code.

  ail build [Node…]     Compile whatever changed, then check everything: the spec is
                        sound, the code is built from it, every check passes, a model
                        has compared each screen with its look, and, with run.app set,
                        the app behaves as the spec says end to end. With nothing to compile it
                        only checks, so CI runs it too. Uses Claude Code's login (a Claude
                        subscription works) unless ANTHROPIC_API_KEY is set.
                        --model M     claude-code[:model], anthropic:<id>, openai:<id>, command:<cli>
                        --force       rebuild even if nothing changed
                        --jobs N      nodes compiled at once (default 4)
                        --no-look     don't have a model compare screens with their look
                        --shots DIR   also screenshot the final screen of every scenario of
                                      nodes with a look (needs Playwright)
                        --samples N   also compile N times per model and compare behaviour
  ail adopt [Node…]     Does the app behave as the spec says? Starts it as ail.config.json's
                        run says (run.legacy while you write the spec of an existing app,
                        else run.app), runs each flow's end-to-end check, and stops it.
                        --app NAME    another entry of run
  ail show [what]       The tree (default), a <Node>, an audience
                        (stakeholder | design | engineer | specialist [tag]),
                        or changes [--since <ref>]
                        --shots DIR   add screenshots of the node shown, or for changes,
                                      of the changed nodes and the nodes that use them

Run it anywhere inside a project that has an ail.config.json.
For the Claude Code plugin: ail mcp, ail hook pre|post.`;

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
  const log = (m: string) => console.error(`· ${m}`);

  switch (cmd) {
    case "build": {
      const r = await build(p, {
        names: nodesOrDie(p, rest), models: a.flags.model, force: flag(a, "force") === "true",
        jobs: Number(flag(a, "jobs") ?? 4), look: flag(a, "no-look") !== "true",
        temperature: flag(a, "temperature") ? Number(flag(a, "temperature")) : undefined,
        samples: Number(flag(a, "samples") ?? 0), shots: flag(a, "shots"), log,
      });
      print(r.text, { outcomes: r.outcomes, check: r.check });
      return r.ok ? 0 : 1;
    }

    case "adopt": {
      const r = await adopt(p, { app: flag(a, "app"), names: nodesOrDie(p, rest), log });
      print(formatAdopt(r), r);
      return r.ok ? 0 : 1;
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

    default:
      console.error(`unknown command "${cmd}"\n\n${HELP}`);
      return 1;
  }
}

if (import.meta.main) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(`ail: ${(e as Error).message}`); process.exit(1); });
}

export { main };
