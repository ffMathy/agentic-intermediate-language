// `ail show`'s views of the spec: the tree, one node, and a review of what
// changed since a git ref.
import { canonicalNode } from "./hash.ts";
import { parseFile, type AilNode, LEVELS } from "./parse.ts";
import { ancestors, dependants, type Project } from "./project.ts";
import { contractOf } from "./hash.ts";

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

const where = (n: AilNode) => (n.dir ? `${n.dir}/` : "./");

/** Nodes whose meaning changed relative to a git ref (cosmetic edits ignored). */
export function changedNodes(p: Project, ref: string): { changed: string[]; added: string[]; removed: string[]; before: Map<string, AilNode> } {
  // Read every spec file that existed at the ref, wherever it lived then, so
  // moving the spec (e.g. into ail/) does not make every node look new.
  const before = new Map<string, AilNode>();
  const ls = Bun.spawnSync(["git", "ls-tree", "-r", "--name-only", "--full-name", ref, "--", "."], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  const top = Bun.spawnSync(["git", "rev-parse", "--show-prefix"], { cwd: p.root, stdout: "pipe" }).stdout.toString().trim();
  // The files the project reads now come first, so a same-named node elsewhere
  // (a fixture, a nested project) never shadows the real one; other files only
  // fill in nodes that have since moved.
  const current = new Set(p.files.map((f) => top + f.file.split("\\").join("/")));
  const paths = ls.stdout.toString().split("\n")
    .filter((f) => f.endsWith(".ail.md") && !/(^|\/)(node_modules|\.[^/]+)\//.test(f.slice(top.length)))
    .sort((a, b) => Number(current.has(b)) - Number(current.has(a)));
  for (const full of paths) {
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
