// What a change affects: the nodes whose checks need to run again, and the
// only ones a pull request's checks show. A node is affected when its meaning
// changed in the spec, when one of its own files changed (its generated code,
// its checks), or when it uses an affected node, directly or not. A change
// that belongs to no one node (the root's target or tokens, the config, the
// package manifest, the page) can reach anything, so it affects every node.
import { relative } from "node:path";
import { e2eCheckPath } from "./adopt.ts";
import { changedNodes } from "./lens.ts";
import { lockPath } from "./lock.ts";
import { dependants, modulePath, type Project } from "./project.ts";
import { isShotFile, legacyShotsDir } from "./shots.ts";
import { derivedCheckFile } from "./verify.ts";

export interface Affected {
  since: string;
  /** Every affected node, in tree order. */
  nodes: string[];
  /** Why the change reaches everything, when it does: the files no one node owns. */
  everything?: string[];
}

/** Files of the project that differ from `ref`, committed or not (untracked ones included), relative to its root. */
export function changedFiles(p: Project, ref: string): string[] {
  const run = (...args: string[]) => {
    const r = Bun.spawnSync(["git", ...args], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
    if (r.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr.toString().trim()}`);
    return r.stdout.toString().split("\n").filter(Boolean);
  };
  return [...new Set([...run("diff", "--name-only", "--relative", ref, "--", "."), ...run("ls-files", "--others", "--exclude-standard", "--", ".")])];
}

export function affectedNodes(p: Project, since: string): Affected {
  const { changed, added } = changedNodes(p, since);
  const direct = new Set([...changed, ...added]);
  // A node's own files, so a change to its code or its checks reaches it.
  const owner = new Map<string, string>();
  const own = (file: string | null | undefined, node: string) => { if (file) owner.set(relative(p.root, file.startsWith("/") ? file : `${p.root}/${file}`).split("\\").join("/"), node); };
  for (const n of p.ordered) {
    own(modulePath(p, n), n.name);
    own(derivedCheckFile(p, n).file, n.name);
    own(e2eCheckPath(p, n), n.name);
  }
  // Written by a build from what's already covered: the spec, the lock, the screenshots, ail's own scratch space.
  const lock = relative(p.root, lockPath(p)).split("\\").join("/");
  const legacy = relative(p.root, legacyShotsDir(p)).split("\\").join("/") + "/";
  const derived = (f: string) => f.endsWith(".ail.md") || f === lock || isShotFile(p, f) || f.startsWith(legacy) || f.startsWith(".ail/") || f.includes("node_modules/");
  const everything: string[] = [];
  for (const f of changedFiles(p, since)) {
    if (derived(f)) continue;
    const n = owner.get(f);
    if (n) direct.add(n); else everything.push(f);
  }
  // The root holds the target and the tokens every node is built with.
  const root = p.ordered.find((n) => n.kind === "system");
  if (root && changed.includes(root.name)) everything.push(`${root.name} (the target and tokens every node is built with)`);
  if (everything.length) return { since, nodes: p.ordered.map((n) => n.name), everything };
  const all = new Set(direct);
  for (const d of direct) for (const u of dependants(p, d)) all.add(u.name);
  return { since, nodes: p.ordered.filter((n) => all.has(n.name)).map((n) => n.name) };
}

/** One line on what a build's checks cover. */
export function formatAffected(a: Affected): string {
  if (a.everything) return `· checks  everything: since ${a.since}, ${a.everything.slice(0, 3).join(", ")}${a.everything.length > 3 ? ` and ${a.everything.length - 3} more` : ""} changed, which no one node owns`;
  if (!a.nodes.length) return `· checks  none needed: nothing changed since ${a.since} reaches a node`;
  return `· checks  only what changed since ${a.since} reaches: ${a.nodes.length} node(s)`;
}
