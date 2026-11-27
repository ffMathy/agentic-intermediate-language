// `ail.lock.json`: which compile hash produced which files. Committed to git.
// No timestamps or machine-specific data, so the lock itself is deterministic.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sha256 } from "./hash.ts";
import type { Project } from "./project.ts";

export interface LockEntry {
  hash: string;
  files: Record<string, string>;
  by?: string;
  /** The build (compile hash) whose screens a model found to match the node's look. */
  look?: string;
  /** The build (compile hash) whose proof screenshots are committed beside its spec, in shots/. */
  shots?: string;
  /** Built by the existing app, not by ail: recorded by `ail adopt` once the spec was proven on it. No generated files. */
  adopted?: boolean;
  /** For an adopted node: the hash of its spec alone, without the target (hash.ts, specHash). */
  spec?: string;
}
/**
 * A node with a look whose code is written by hand (adopted, `@existing`, or of a kind the target doesn't build):
 * its derived check pictures it, so its screenshots and look verdict are keyed to that check's pin.
 */
export interface HandEntry {
  /** The pin of the derived check whose screenshots are committed beside the spec, in shots/. */
  shots?: string;
  /** The pin of the derived check whose screens a model found to match the node's look. */
  look?: string;
}
export interface Lock { version: 1; nodes: Record<string, LockEntry>; glue: Record<string, string>; hand?: Record<string, HandEntry> }

export const lockPath = (p: Project) => join(p.root, p.config.lockFile ?? "ail.lock.json");

export function readLock(p: Project): Lock {
  const f = lockPath(p);
  if (!existsSync(f)) return { version: 1, nodes: {}, glue: {} };
  return JSON.parse(readFileSync(f, "utf8"));
}

export function writeLock(p: Project, lock: Lock) {
  const sorted: Lock = {
    version: 1,
    nodes: Object.fromEntries(Object.entries(lock.nodes).sort(([a], [b]) => a.localeCompare(b))),
    glue: Object.fromEntries(Object.entries(lock.glue).sort(([a], [b]) => a.localeCompare(b))),
    ...(lock.hand && Object.keys(lock.hand).length ? { hand: Object.fromEntries(Object.entries(lock.hand).sort(([a], [b]) => a.localeCompare(b))) } : {}),
  };
  writeFileSync(lockPath(p), JSON.stringify(sorted, null, 2) + "\n");
}

export function fileHash(p: Project, rel: string): string | null {
  const f = join(p.root, rel);
  return existsSync(f) ? sha256(readFileSync(f, "utf8")) : null;
}
