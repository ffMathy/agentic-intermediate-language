// `ail lens` and `ail review`: one source, projections per audience.
import { canonicalNode } from "./hash.ts";
import { parseFile, type AilNode, LEVELS } from "./parse.ts";
import { ancestors, dependants, type Project } from "./project.ts";
import { contractOf } from "./hash.ts";

export const LENSES = ["stakeholder", "design", "engineer", "specialist"] as const;
export type Lens = (typeof LENSES)[number];

const AUDIENCE: Record<string, string> = {
  product: "stakeholders / product",
  experience: "design, QA and product",
  system: "engineers",
  specialist: "domain specialists",
};

function block(n: AilNode, keys: string[] | "all"): string {
  const lines = [n.raw[0]!];
  for (const s of n.sections) if (keys === "all" || keys.includes(s.key)) lines.push(...s.raw);
  while (lines.length && lines.at(-1)!.trim() === "") lines.pop();
  return "```ail\n" + lines.join("\n") + "\n```";
}

const heading = (p: Project, n: AilNode) => "#".repeat(Math.min(6, ancestors(p, n.name).length + 2));

const where = (n: AilNode) => (n.dir ? `${n.dir}/` : "./");

/** "Used by" line for nodes that more than one other node depends on. */
export function usedBy(p: Project, n: AilNode): string | null {
  const users = p.ordered.filter((u) => u.uses.includes(n.name));
  if (users.length < 2) return null;
  return `_Used by ${users.map((u) => `${u.name} (${where(u)})`).join(", ")}._`;
}

function plainSummary(n: AilNode): string[] {
  const out: string[] = [];
  if (n.why) out.push(`*Why:* ${n.why.text.replace(/<-\s*\S+/g, "").trim()}`);
  if (n.level === "product" && n.claims.length) out.push(...n.claims.map((c) => `- ${c.text.replace(/^\d+\.\s*/, "")}`));
  for (const s of n.scenarios) out.push(`- **${s.title}** — ${s.steps.join(" ")}`);
  return out;
}

export function renderLens(p: Project, lens: Lens, opts: { tag?: string; only?: Set<string> } = {}): string {
  const out: string[] = [`# ${lens[0]!.toUpperCase() + lens.slice(1)} lens`];
  const pick = (n: AilNode) => !opts.only || opts.only.has(n.name);
  let hidden = 0;

  if (lens === "specialist") {
    const targets = p.ordered.filter((n) => (opts.tag ? n.tags.includes(opts.tag) : n.level === "specialist") && pick(n));
    for (const n of targets) {
      out.push(`\n## ${n.name}`);
      const chain = ancestors(p, n.name);
      if (chain.length) out.push("Why chain:\n" + chain.map((a) => `- **${a.name}**: ${a.why?.text ?? ""}`).join("\n"));
      out.push(block(n, "all"));
    }
    if (!targets.length) out.push(`\n_No nodes ${opts.tag ? "tagged @" + opts.tag : "at the specialist level"}._`);
    return out.join("\n") + "\n";
  }

  for (const n of p.ordered) {
    if (!pick(n)) continue;
    const lvl = LEVELS.indexOf(n.level ?? "system");
    if (lens === "stakeholder") {
      if (lvl > 1) { hidden++; continue; }
      out.push(`\n${heading(p, n)} ${n.name}`);
      out.push(plainSummary(n).join("\n"));
    } else if (lens === "design") {
      if (lvl > 1) { hidden++; continue; }
      out.push(`\n${heading(p, n)} ${n.name} · ${n.level} · ${where(n)}`);
      const shared = usedBy(p, n);
      if (shared) out.push(shared);
      out.push(block(n, "all"));
    } else {
      out.push(`\n${heading(p, n)} ${n.name} · ${n.level} · ${where(n)}`);
      const shared = usedBy(p, n);
      if (shared) out.push(shared);
      out.push(lvl === 3 ? block(n, ["why", "what"]) + "\n_(how collapsed — see the specialist lens)_" : block(n, "all"));
    }
  }
  if (hidden) out.push(`\n_${hidden} more detailed node(s) hidden in this lens._`);
  if ((lens === "stakeholder" || lens === "design") && p.glossary.length)
    out.push(`\n## Glossary\n` + p.glossary.map((t) => `- **${t.term}** — ${t.plain}`).join("\n"));
  return out.join("\n") + "\n";
}

/** Nodes whose meaning changed relative to a git ref (cosmetic edits ignored). */
export function changedNodes(p: Project, ref: string): { changed: string[]; added: string[]; removed: string[]; before: Map<string, AilNode> } {
  // Read every spec file that existed at the ref, wherever it lived then, so
  // moving the spec (e.g. into ail/) does not make every node look new.
  const before = new Map<string, AilNode>();
  const ls = Bun.spawnSync(["git", "ls-tree", "-r", "--name-only", "--full-name", ref, "--", "."], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  const top = Bun.spawnSync(["git", "rev-parse", "--show-prefix"], { cwd: p.root, stdout: "pipe" }).stdout.toString().trim();
  for (const full of ls.stdout.toString().split("\n").filter((f) => f.endsWith(".ail.md") && !/(^|\/)node_modules\//.test(f))) {
    const r = Bun.spawnSync(["git", "show", `${ref}:${full}`], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
    if (r.exitCode !== 0) continue;
    const rel = full.startsWith(top) ? full.slice(top.length) : full;
    for (const n of parseFile(rel, r.stdout.toString()).nodes) if (!before.has(n.name)) before.set(n.name, n);
  }
  const changed: string[] = [], added: string[] = [];
  for (const n of p.ordered) {
    const b = before.get(n.name);
    if (!b) added.push(n.name);
    else if (canonicalNode(b) !== canonicalNode(n)) changed.push(n.name);
  }
  const removed = [...before.keys()].filter((k) => !p.nodes.has(k));
  return { changed, added, removed, before };
}

export function renderReview(p: Project, ref: string): string {
  const { changed, added, removed, before } = changedNodes(p, ref);
  const touched = [...changed, ...added];
  if (!touched.length && !removed.length) return `No semantic IL changes since ${ref}.\n`;
  const out = [`# IL review since ${ref}`];
  for (const level of LEVELS) {
    const here = touched.map((t) => p.nodes.get(t)!).filter((n) => (n.level ?? "system") === level);
    if (!here.length) continue;
    out.push(`\n## ${level} — reviewers: ${AUDIENCE[level]}`);
    for (const n of here) {
      out.push(`\n### ${added.includes(n.name) ? "＋" : "✎"} ${n.name}`);
      const chain = ancestors(p, n.name);
      if (chain.length) out.push(chain.map((a) => `> **${a.name}** — ${a.why?.text ?? ""}`).join("\n>\n"));
      const old = before.get(n.name);
      if (old && contractOf(old) !== contractOf(n)) {
        const reach = dependants(p, n.name);
        if (reach.length) out.push(`**Contract changed** — this reaches ${reach.map((d) => `${d.name} (${d.level}, ${where(d)})`).join(", ")}; their reviewers should look too.`);
      }
      out.push(block(n, "all"));
    }
  }
  if (removed.length) out.push(`\n## Removed\n${removed.map((r) => `- ${r}`).join("\n")}`);
  return out.join("\n") + "\n";
}

/** The whole tree with kind, level, folder, build status and sharing. */
export function renderTree(p: Project, status: Map<string, string>): string {
  return p.ordered.map((n) => {
    const users = p.ordered.filter((u) => u.uses.includes(n.name)).length;
    const st = status.get(n.name);
    return `${"  ".repeat(ancestors(p, n.name).length)}${n.name} : ${n.kind} · ${n.level} · ${n.dir || "."}${st ? ` [${st}]` : ""}${users > 1 ? ` (used by ${users})` : ""}`;
  }).join("\n") + "\n";
}

/** One node: where it lives, its status, who it serves, and its source. */
export function renderNode(p: Project, n: AilNode, status?: string): string {
  const users = p.ordered.filter((u) => u.uses.includes(n.name));
  const reach = dependants(p, n.name);
  const lines = [
    `${n.name} : ${n.kind} · ${n.level} — ${n.file}:${n.line}${status ? ` [${status}]` : ""}`,
    ...(ancestors(p, n.name).length ? [`path:     ${[...ancestors(p, n.name).map((a) => a.name), n.name].join(" › ")}`] : []),
    ...(n.uses.length ? [`uses:     ${n.uses.join(", ")}`] : []),
    ...(users.length ? [`used by:  ${users.map((u) => `${u.name} (${where(u)})`).join(", ")}`] : []),
    ...(reach.length > users.length ? [`reaches:  ${reach.map((u) => u.name).join(", ")}`] : []),
    "",
    "```ail",
    ...n.raw,
    "```",
  ];
  return lines.join("\n") + "\n";
}
