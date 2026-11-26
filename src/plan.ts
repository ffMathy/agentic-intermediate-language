// `ail plan`: which nodes are fresh, stale, missing or drifted.
import { compileHash, specHash } from "./hash.ts";
import { fileHash, readLock, type LockEntry } from "./lock.ts";
import type { AilNode } from "./parse.ts";
import { isCompilable, modulePath, topoByUses, type Project } from "./project.ts";

/**
 * Is an adopted node still built by the existing app? By default it is until
 * its compile hash changes, so changing the target to a new technology
 * rebuilds the whole app. A project that moves node by node
 * (`"migrate": "node-by-node"`) keeps it adopted until its own spec changes,
 * whatever the target says: the target's conventions are for generated code.
 */
export const adoptedFresh = (p: Project, n: AilNode, e: LockEntry | undefined): boolean =>
  !!e?.adopted && (e.hash === compileHash(p, n) || (p.config.migrate === "node-by-node" && !!e.spec && e.spec === specHash(p, n)));

export type Status = "fresh" | "stale" | "missing" | "drifted" | "orphaned";
export interface PlanEntry { node: string; status: Status; hash: string; path: string; reason: string }

export function plan(p: Project): PlanEntry[] {
  const lock = readLock(p);
  const orphaned: PlanEntry[] = Object.entries(lock.nodes)
    .filter(([name]) => { const n = p.nodes.get(name); return !n || !isCompilable(p, n); })
    .map(([name, e]) => ({ node: name, status: "orphaned" as const, hash: e.hash, path: Object.keys(e.files).join(", "), reason: "node no longer in the IL; `ail build` removes its output" }));
  return [...orphaned, ...topoByUses(p, p.ordered.filter((n) => isCompilable(p, n))).map((n) => {
    const hash = compileHash(p, n);
    const path = modulePath(p, n)!;
    const entry = lock.nodes[n.name];
    // Adopted: the existing app is this node's build, until its spec changes; then ail builds it.
    if (entry?.adopted) return adoptedFresh(p, n, entry)
      ? { node: n.name, status: "fresh" as const, hash, path, reason: "built by the existing app (adopted)" }
      : { node: n.name, status: "stale" as const, hash, path, reason: "its spec changed since it was adopted; ail build compiles it" };
    const actual = fileHash(p, path);
    if (entry && !entry.files[path]) return { node: n.name, status: "stale" as const, hash, path, reason: `moved from ${Object.keys(entry.files).join(", ")}` };
    if (!entry || actual === null) return { node: n.name, status: "missing" as const, hash, path, reason: entry ? "file deleted" : "never compiled" };
    if (entry.files[path] !== actual) return { node: n.name, status: "drifted" as const, hash, path, reason: "generated file was edited by hand" };
    if (entry.hash !== hash) return { node: n.name, status: "stale" as const, hash, path, reason: "its spec, a dependency's contract, or the target changed" };
    return { node: n.name, status: "fresh" as const, hash, path, reason: "" };
  })];
}

export function formatPlan(entries: PlanEntry[]): string {
  const icon = { fresh: "✓", stale: "~", missing: "+", drifted: "!", orphaned: "-" };
  const lines = entries.map((e) => `${icon[e.status]} ${e.node.padEnd(20)} ${e.status.padEnd(8)} ${e.hash.slice(0, 12)}  ${e.path}${e.reason ? "  (" + e.reason + ")" : ""}`);
  const todo = entries.filter((e) => e.status !== "fresh").length;
  lines.push(`\n${todo} node(s) need compiling, ${entries.length - todo} fresh`);
  return lines.join("\n");
}
