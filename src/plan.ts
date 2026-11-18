// `ail plan`: which nodes are fresh, stale, missing or drifted.
import { compileHash } from "./hash.ts";
import { fileHash, readLock } from "./lock.ts";
import { isCompilable, modulePath, topoByUses, type Project } from "./project.ts";

export type Status = "fresh" | "stale" | "missing" | "drifted" | "orphaned";
export interface PlanEntry { node: string; status: Status; hash: string; path: string; reason: string }

export function plan(p: Project): PlanEntry[] {
  const lock = readLock(p);
  const orphaned: PlanEntry[] = Object.entries(lock.nodes)
    .filter(([name]) => { const n = p.nodes.get(name); return !n || !isCompilable(p, n); })
    .map(([name, e]) => ({ node: name, status: "orphaned" as const, hash: e.hash, path: Object.keys(e.files).join(", "), reason: "node no longer in the IL; `ail prune` removes its output" }));
  return [...orphaned, ...topoByUses(p, p.ordered.filter((n) => isCompilable(p, n))).map((n) => {
    const hash = compileHash(p, n);
    const path = modulePath(p, n)!;
    const entry = lock.nodes[n.name];
    const actual = fileHash(p, path);
    if (entry && !entry.files[path]) return { node: n.name, status: "stale" as const, hash, path, reason: `moved from ${Object.keys(entry.files).join(", ")}` };
    if (!entry || actual === null) return { node: n.name, status: "missing" as const, hash, path, reason: entry ? "file deleted" : "never compiled" };
    if (entry.files[path] !== actual) return { node: n.name, status: "drifted" as const, hash, path, reason: "generated file was edited by hand" };
    if (entry.hash !== hash) return { node: n.name, status: "stale" as const, hash, path, reason: "spec, contract of a dependency, or profile changed" };
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
