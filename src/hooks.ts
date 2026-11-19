// Agent hooks. They read the hook payload on stdin (Claude Code format:
// { tool_name, tool_input: { file_path } }) and exit 2 with a message on
// stderr to block or to feed problems back to the agent.
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { formatDiagnostics, lint } from "./lint.ts";
import { findRoot, loadProject } from "./project.ts";

export interface HookResult { code: 0 | 2; message: string }

function targetPath(payload: unknown): string | null {
  const input = (payload as { tool_input?: Record<string, unknown> })?.tool_input ?? {};
  const p = input.file_path ?? input.notebook_path ?? input.path;
  return typeof p === "string" ? p : null;
}

/** The AIL project containing a file, or null when the file isn't in one (hooks then do nothing). */
function projectFor(file: string): string | null {
  const root = findRoot(dirname(file));
  return existsSync(join(root, "ail.config.json")) ? root : null;
}

export function generatedGlobs(root?: string): { root: string; globs: string[] } {
  const p = loadProject(root);
  const globs = (p.target?.settings["generated"] ?? "").split(/[\s,]+/).filter(Boolean);
  return { root: p.root, globs };
}

/** PreToolUse: refuse direct edits to generated code. */
export function preHook(payload: unknown, cwd = process.cwd()): HookResult {
  const file = targetPath(payload);
  if (!file) return { code: 0, message: "" };
  const abs = resolve(cwd, file);
  const project = projectFor(abs);
  if (!project) return { code: 0, message: "" };
  const { root, globs } = generatedGlobs(project);
  const rel = relative(root, abs);
  if (rel.startsWith("..")) return { code: 0, message: "" };
  const hit = globs.find((g) => new Bun.Glob(g).match(rel));
  if (!hit) return { code: 0, message: "" };
  return {
    code: 2,
    message: `${rel} is generated from the IL (matches "${hit}"). Do not edit it directly: change the .ail.md source and run \`ail build\` (or \`/ail:build\` in Claude Code).`,
  };
}

/** PostToolUse: lint after an .ail.md file changes and report errors back. */
export function postHook(payload: unknown, cwd = process.cwd()): HookResult {
  const file = targetPath(payload);
  if (!file || !file.endsWith(".ail.md")) return { code: 0, message: "" };
  const project = projectFor(resolve(cwd, file));
  if (!project) return { code: 0, message: "" };
  const p = loadProject(project);
  const errors = lint(p).filter((d) => d.severity === "error");
  if (!errors.length) return { code: 0, message: "" };
  return { code: 2, message: `the spec has problems after editing ${file}:\n${formatDiagnostics(errors)}` };
}
