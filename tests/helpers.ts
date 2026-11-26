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

/** A TCP port that is free right now, chosen by the OS. A random port in a fixed range can collide with the local
 * end of any outgoing connection (Linux hands those out from 32768-60999). */
export function freePort(): number {
  const server = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } });
  const port = server.port;
  server.stop(true);
  return port;
}
