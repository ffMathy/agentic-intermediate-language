import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
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

/** A spec file's path under `dir`, its folder made: every node has a folder of its own. */
export function specFile(dir: string, rel: string): string {
  mkdirSync(dirname(join(dir, rel)), { recursive: true });
  return join(dir, rel);
}

/** The spec file under `dir` that holds `text` (a spec file holds one node, so a test edits the one that has it). */
export function specFileWith(dir: string, text: string): string {
  for (const f of new Bun.Glob("**/*.ail.md").scanSync({ cwd: dir })) {
    const path = join(dir, f);
    if (readFileSync(path, "utf8").includes(text)) return path;
  }
  throw new Error(`no spec file in ${dir} holds: ${text}`);
}

/** A TCP port that is free right now, chosen by the OS. A random port in a fixed range can collide with the local
 * end of any outgoing connection (Linux hands those out from 32768-60999). */
export function freePort(): number {
  const server = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } });
  const port = server.port;
  server.stop(true);
  return port;
}
