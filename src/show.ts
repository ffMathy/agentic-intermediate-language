// `ail show`: one way to look at the spec — the tree, one node, or what changed.
import { renderNode, renderReview, renderTree } from "./lens.ts";
import { plan } from "./plan.ts";
import type { Project } from "./project.ts";

export const SHOW_TARGETS = ["", "changes", "<Node>"];

/** origin/main when it exists, otherwise HEAD. */
export function defaultBase(p: Project): string {
  const r = Bun.spawnSync(["git", "rev-parse", "--verify", "--quiet", "origin/main"], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  return r.exitCode === 0 ? "origin/main" : "HEAD";
}

export function show(p: Project, target = "", opts: { since?: string } = {}): string {
  const status = new Map(plan(p).map((e) => [e.node, e.status as string]));
  if (!target || target === "tree") return renderTree(p, status);
  if (target === "changes") return renderReview(p, opts.since ?? defaultBase(p));
  const n = p.nodes.get(target);
  if (n) return renderNode(p, n, status.get(n.name));
  throw new Error(`nothing called "${target}". Show the tree (no argument), changes, or a node: ${[...p.nodes.keys()].join(", ")}`);
}
