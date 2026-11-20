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
  /** The build (compile hash) whose proof screenshots are committed in checks/shots/. */
  shots?: string;
}
export interface Lock { version: 1; nodes: Record<string, LockEntry>; glue: Record<string, string> }

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
  };
  writeFileSync(lockPath(p), JSON.stringify(sorted, null, 2) + "\n");
}

export function fileHash(p: Project, rel: string): string | null {
  const f = join(p.root, rel);
  return existsSync(f) ? sha256(readFileSync(f, "utf8")) : null;
}
