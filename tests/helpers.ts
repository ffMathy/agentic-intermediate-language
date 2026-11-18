import { cpSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadProject } from "../src/project.ts";

export const KATA = join(import.meta.dir, "..", "examples", "tictactoe");

/** Copy a fixture project into a fresh temp dir so tests can write to it. */
export function tempProject(fixture = "mini"): string {
  const dir = mkdtempSync(join(tmpdir(), "ail-test-"));
  cpSync(join(import.meta.dir, "fixtures", fixture), dir, { recursive: true });
  return dir;
}

export function mockFile(dir: string, responses: Record<string, string[]>): string {
  const f = join(dir, "mock.json");
  writeFileSync(f, JSON.stringify(responses));
  return f;
}

export const reply = (path: string, body: string) => `=== FILE: ${path} ===\n${body}\n=== END ===`;

export const load = (dir: string) => loadProject(dir);
