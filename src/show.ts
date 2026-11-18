// `ail show`: one way to look at the spec — the tree, a node, an audience's
// view, or what changed.
import { LENSES, renderLens, renderNode, renderReview, renderTree, type Lens } from "./lens.ts";
import { plan } from "./plan.ts";
import type { Project } from "./project.ts";

export const SHOW_TARGETS = ["", ...LENSES, "changes", "<Node>"];

/** origin/main when it exists, otherwise HEAD. */
export function defaultBase(p: Project): string {
  const r = Bun.spawnSync(["git", "rev-parse", "--verify", "--quiet", "origin/main"], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  return r.exitCode === 0 ? "origin/main" : "HEAD";
}

export function show(p: Project, target = "", opts: { tag?: string; since?: string } = {}): string {
  const status = new Map(plan(p).map((e) => [e.node, e.status as string]));
  if (!target || target === "tree") return renderTree(p, status);
  if ((LENSES as readonly string[]).includes(target)) return renderLens(p, target as Lens, { tag: opts.tag });
  if (target === "changes") return renderReview(p, opts.since ?? defaultBase(p));
  const n = p.nodes.get(target);
  if (n) return renderNode(p, n, status.get(n.name));
  throw new Error(`nothing called "${target}". Show the tree (no argument), ${LENSES.join(", ")}, changes, or a node: ${[...p.nodes.keys()].join(", ")}`);
}
