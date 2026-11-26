// Only what a change affects is checked, and shown, on a pull request.
import { expect, test } from "bun:test";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { affectedNodes, formatAffected } from "../src/affected.ts";
import { loadProject } from "../src/project.ts";
import { KATA } from "./helpers.ts";

/** The kata (without its dependencies) in a fresh git repository, at one commit. */
function repo(): string {
  const dir = mkdtempSync(join(tmpdir(), "ail-affected-"));
  cpSync(KATA, dir, { recursive: true, filter: (f) => !f.includes("node_modules") && !f.includes("/.ail") });
  const git = (...a: string[]) => Bun.spawnSync(["git", ...a], { cwd: dir, stdout: "pipe", stderr: "pipe" });
  git("init", "-q");
  git("add", "-A");
  git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "base");
  return dir;
}

test("nothing changed: nothing to check", () => {
  const dir = repo();
  const a = affectedNodes(loadProject(dir), "HEAD");
  expect(a.nodes).toEqual([]);
  expect(formatAffected(a)).toContain("none needed");
});

test("a node's check changed: that node and every node that uses it, directly or not", () => {
  const dir = repo();
  appendFileSync(join(dir, "checks/ui/text/text.test.tsx"), "\n// a new case\n");
  const a = affectedNodes(loadProject(dir), "HEAD");
  expect(a.nodes).toEqual(expect.arrayContaining(["Text", "StatusLine", "PlayAGame", "TicTacToe"]));
  expect(a.nodes).not.toContain("Rules");
  expect(a.nodes).not.toContain("Button");
  expect(a.everything).toBeUndefined();
});

test("a node's generated code changed: it is affected", () => {
  const dir = repo();
  appendFileSync(join(dir, "src/gen/engine/rules/rules.ts"), "\n");
  expect(affectedNodes(loadProject(dir), "HEAD").nodes).toContain("Rules");
});

test("the lock changing on its own affects nothing: a build writes it", () => {
  const dir = repo();
  writeFileSync(join(dir, "ail.lock.json"), readFileSync(join(dir, "ail.lock.json"), "utf8") + "\n");
  expect(affectedNodes(loadProject(dir), "HEAD").nodes).toEqual([]);
});

test("a change no one node owns affects everything, and says which", () => {
  const dir = repo();
  appendFileSync(join(dir, "index.html"), "\n<!-- x -->\n");
  const p = loadProject(dir);
  const a = affectedNodes(p, "HEAD");
  expect(a.nodes.length).toBe(p.ordered.length);
  expect(a.everything).toEqual(["index.html"]);
  expect(formatAffected(a)).toContain("index.html");
});
