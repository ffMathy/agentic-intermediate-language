// How the end-to-end checks are written and run. By default they are bun tests
// in TypeScript, but they follow the target's language, like its derived
// checks (the target's `checks.path` and `checks.run`): a C# app's are xUnit
// tests, a Python app's pytest tests. `tests` in ail.config.json says where a
// flow's end-to-end check lives and which command runs it; ail reads each
// scenario's outcome from the JUnit (or TRX) report that command writes, and
// pairs it with the screenshot the scenario saved.
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import type { AilNode } from "./parse.ts";
import { kebab, type Project } from "./project.ts";

/** A node's name and folder in a path or command template: {dir}, {kebab}, {name}. */
export function fillNode(tpl: string, n: AilNode): string {
  return tpl.replaceAll("{dir}", n.dir).replaceAll("{kebab}", kebab(n.name)).replaceAll("{name}", n.name);
}

const checksRoot = (p: Project) => join(p.root, p.config.checksDir ?? "checks");

/** Whether the end-to-end checks are run by the project's own command (in the target's language) rather than bun. */
export const ownRunner = (p: Project) => !!p.config.tests?.command;

/** Where a flow's end-to-end check lives (absolute): `tests.e2e`, else checks/e2e/<dir>/<kebab>.e2e.ts (not picked up by a plain `bun test`). */
export function e2eCheckPath(p: Project, n: AilNode): string {
  const tpl = p.config.tests?.e2e;
  return tpl ? resolve(p.root, fillNode(tpl, n)) : join(checksRoot(p), "e2e", n.dir, `${kebab(n.name)}.e2e.ts`);
}

/** The line-comment marker of a check file's language, for its pin. */
export function commentFor(file: string): string {
  const ext = /\.([a-z0-9]+)$/i.exec(file)?.[1]?.toLowerCase() ?? "";
  if (["py", "rb", "sh", "bash", "r", "pl", "ex", "exs", "jl", "nim", "cr", "ps1", "yml", "yaml", "toml", "feature", "robot"].includes(ext)) return "#";
  if (["sql", "lua", "hs", "elm", "ada"].includes(ext)) return "--";
  if (["clj", "cljs", "lisp", "el", "scm"].includes(ext)) return ";;";
  if (["erl", "hrl", "tex"].includes(ext)) return "%";
  if (["vb", "bas"].includes(ext)) return "'";
  return "//";
}

const PIN = /^[ \t]*(?:\/\/|#|--|;;|%|')[ \t]*ail-derived-from:[ \t]*(\w+)@([0-9a-f]+)/m;

/** The node and spec hash a check is pinned to, from its `ail-derived-from` comment (any language's). */
export function pinOf(text: string): { node: string; hash: string } | null {
  const m = PIN.exec(text);
  return m ? { node: m[1]!, hash: m[2]! } : null;
}

/** A check's text with its pin set to `node@hash`: the pin line replaced, or added as the first line. */
export function withPin(file: string, text: string, node: string, hash: string): string {
  const line = `${commentFor(file)} ail-derived-from: ${node}@${hash}`;
  return PIN.test(text) ? text.replace(PIN, line) : `${line}\n${text}`;
}

const unescapeXml = (s: string) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#x?([0-9a-f]+);/gi, (m, c: string) => {
  const code = m.startsWith("&#x") ? parseInt(c, 16) : parseInt(c, 10);
  return Number.isFinite(code) ? String.fromCodePoint(code) : m;
}).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export interface TestOutcome { name: string; ok: boolean; message?: string }

/**
 * The tests of a JUnit or TRX report, in run order, without skipped ones:
 * each test's name and whether it passed, with the failure message if not.
 */
export function reportTests(xml: string): TestOutcome[] {
  const out: TestOutcome[] = [];
  if (/<TestRun\b/.test(xml)) {
    for (const m of xml.matchAll(/<UnitTestResult\b([^>]*?)(\/>|>([\s\S]*?)<\/UnitTestResult>)/g)) {
      const outcome = /\boutcome="([^"]*)"/.exec(m[1]!)?.[1] ?? "";
      if (/^(NotExecuted|Inconclusive|Pending)$/.test(outcome)) continue;
      const name = unescapeXml(/\btestName="([^"]*)"/.exec(m[1]!)?.[1] ?? "");
      const message = /<Message>([\s\S]*?)<\/Message>/.exec(m[3] ?? "")?.[1];
      out.push({ name, ok: outcome === "Passed", ...(outcome === "Passed" ? {} : { message: message ? unescapeXml(message).trim() : outcome }) });
    }
    return out;
  }
  for (const m of xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const body = m[3] ?? "";
    if (/<skipped\b/.test(body)) continue;
    const name = unescapeXml(/\bname="([^"]*)"/.exec(m[1]!)?.[1] ?? "");
    const failure = /<(failure|error)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/.exec(body);
    if (!failure) { out.push({ name, ok: true }); continue; }
    const attr = /\bmessage="([^"]*)"/.exec(failure[2] ?? "")?.[1];
    const text = (failure[3] ?? "").replace(/^<!\[CDATA\[|\]\]>$/g, "");
    out.push({ name, ok: false, message: unescapeXml(attr ?? text).trim() || "failed" });
  }
  return out;
}

export interface RunResult { ok: boolean; tests: TestOutcome[]; failures: string[]; passes: number; output: string }

/**
 * Run one end-to-end check file. With `tests.command`, that shell command runs from the
 * project with {file} (relative to the project), {node}, {dir}, {kebab},
 * {name} and {report} (where to write its JUnit or TRX report) filled in, and
 * the same values in AIL_CHECK_FILE, AIL_CHECK_NODE and AIL_TEST_REPORT.
 * Without one, it is `bun test` with its JUnit reporter (from `bunCwd`).
 */
export function runCheckFile(p: Project, n: AilNode, abs: string, env: Record<string, string> = {}, bunCwd = p.root): RunResult {
  const tmp = mkdtempSync(join(tmpdir(), "ail-run-"));
  const report = join(tmp, "report.xml");
  try {
    const file = relative(p.root, abs).split("\\").join("/");
    const cmd = p.config.tests?.command;
    const r = cmd
      ? Bun.spawnSync(["sh", "-c", fillNode(cmd, n).replaceAll("{file}", file).replaceAll("{node}", n.name).replaceAll("{report}", report)], {
          cwd: p.root, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", ...env, AIL_CHECK_FILE: file, AIL_CHECK_NODE: n.name, AIL_TEST_REPORT: report }, stdout: "pipe", stderr: "pipe",
        })
      : Bun.spawnSync(["bun", "test", "--reporter=junit", `--reporter-outfile=${report}`, abs], {
          cwd: bunCwd, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", ...env }, stdout: "pipe", stderr: "pipe",
        });
    const output = r.stdout.toString() + r.stderr.toString();
    const tests = existsSync(report) ? reportTests(readFileSync(report, "utf8")) : [];
    const failed = tests.filter((t) => !t.ok);
    // A run that reports nothing ran nothing: it failed to build or to start.
    const ok = r.exitCode === 0 && (tests.length > 0 || !cmd) && !failed.length;
    return { ok, tests, failures: failed.map((t) => t.name), passes: tests.filter((t) => t.ok).length, output };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Run `tests.prepare` (building the end-to-end checks), once before they run. Null when it passes or there is none. */
export function prepareChecks(p: Project, env: Record<string, string> = {}): string | null {
  const cmd = p.config.tests?.prepare;
  if (!cmd) return null;
  const r = Bun.spawnSync(["sh", "-c", cmd], { cwd: p.root, env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe" });
  if (r.exitCode === 0) return null;
  return `preparing the checks (${cmd}) failed (${r.exitCode}):\n${(r.stdout.toString() + r.stderr.toString()).trim().split("\n").slice(-20).join("\n")}`;
}

/** What failed in a run, for a report: each failed test with its message, or the end of the output. */
export function failureText(r: RunResult, maxLines = 20): string {
  const failed = r.tests.filter((t) => !t.ok);
  if (failed.length) return failed.map((t) => `✗ ${t.name}${t.message ? `\n  ${t.message.split("\n").slice(0, 6).join("\n  ")}` : ""}`).join("\n").split("\n").slice(0, maxLines * 2).join("\n");
  return r.output.trim().split("\n").slice(-maxLines).join("\n");
}
