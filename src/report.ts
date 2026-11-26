// The checks of a build, for a pull request's description: one collapsible
// section per check (a node's tests, a flow's end-to-end check), each test
// with a check mark or a cross, and under it the screen it ended on when
// there is one. `ail build --report` writes the build's results as JSON; this
// renders them, and keeps one section per project in a description.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { AdoptReport } from "./adopt.ts";
import type { Affected } from "./affected.ts";
import type { CheckReport } from "./check.ts";
import type { Project } from "./project.ts";
import { lockPath } from "./lock.ts";
import { isShotFile, legacyShotsDir, nodeShotsDir, readShotsIndex, type Shot } from "./shots.ts";
import type { TestResult } from "./verify.ts";

export interface BuildReport {
  ok: boolean; check: CheckReport | null; e2e: AdoptReport | null; text: string;
  /** When the build ran only what a change affects (`--since`): what that was. */
  affected?: Affected;
  /** The commit the build ran on, and whether files were changed on top of it. */
  head?: string; dirty?: boolean;
}

/** Every build saves its results here, for `ail show checks`. */
export const lastReportPath = (p: Project) => join(p.root, ".ail", "last-build.json");

const git = (cwd: string, ...args: string[]) => {
  const r = Bun.spawnSync(["git", ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  return r.exitCode === 0 ? r.stdout.toString().trim() : null;
};

/** The commit a build runs on: HEAD, and whether the working tree differs from it. Taken before the build writes
 * anything, so its own output (proof screenshots, the lock file) never counts as a change it ran on. */
export function buildHead(p: Project): { head?: string; dirty?: boolean } {
  const head = git(p.root, "rev-parse", "HEAD");
  return head ? { head, dirty: !!git(p.root, "status", "--porcelain", "--", ".") } : {};
}

export function writeReport(file: string, r: BuildReport) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(r, null, 2));
}

export const readReport = (file: string): BuildReport => JSON.parse(readFileSync(file, "utf8"));

const OK = "✅", FAIL = "❌", WARN = "⚠️";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s: string) => esc(s).replace(/"/g, "&quot;");

interface Section { title: string; ok: boolean; tests: TestResult[]; problems: string[]; shots: { test: string; file: string }[]; note?: string }

/**
 * Markdown for every check of a build. Screens are those just taken (`shots`,
 * under `outDir`), else the ones the build committed; with `outDir` and
 * `base` they are copied under `outDir` and linked as `<base>/<path>`, and
 * without them only the tests are listed.
 */
export function renderChecks(p: Project, r: BuildReport, opts: { shots?: Shot[]; outDir?: string; base?: string; link?: (file: string) => string | null } = {}): string {
  const link = (file: string): string | null => {
    if (opts.link) return existsSync(file) ? opts.link(file) : null;
    if (!opts.outDir || !opts.base || !existsSync(file)) return null;
    let rel = relative(opts.outDir, file);
    if (rel.startsWith("..")) {
      // A committed screenshot: published next to the fresh ones.
      rel = relative(p.root, file);
      const dest = join(opts.outDir, rel);
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(file, dest);
    }
    return `${opts.base.replace(/\/$/, "")}/${rel.split("\\").join("/")}`;
  };
  const fresh = (node: string) => (opts.shots ?? []).filter((s) => s.node === node);
  const committed = (node: string) => {
    const n = p.nodes.get(node);
    return (n && readShotsIndex(nodeShotsDir(p, n))?.shots) ?? [];
  };

  const sections: Section[] = [];
  let quiet = 0;
  for (const res of r.check?.verify.results ?? []) {
    const tests = res.checks.find((c) => c.kind === "tests");
    const problems = res.checks.filter((c) => !c.ok).map((c) => `${c.severity === "warning" ? WARN : FAIL} ${c.kind}: ${c.detail}`);
    if (!tests && !problems.length) { quiet++; continue; }
    const now = fresh(res.node);
    const shots = [...now, ...committed(res.node).filter((c) => !now.some((x) => x.test === c.test))];
    sections.push({ title: res.node, ok: res.ok, tests: tests?.tests ?? [], problems, shots });
  }
  for (const e of r.e2e?.results ?? []) {
    if (e.status === "missing") continue;
    const failed = e.status !== "pass";
    sections.push({
      title: `${e.node} · end to end`, ok: !failed, tests: e.tests ?? [], shots: e.shots ?? [],
      problems: failed ? [`${e.status === "stale" ? WARN : FAIL} ${e.status}: ${e.detail}`] : [],
      note: e.file ?? undefined,
    });
  }

  const out: string[] = [];
  const all = sections.flatMap((s) => s.tests);
  const passed = all.filter((t) => t.ok).length;
  const head = r.check ? `${passed} of ${all.length} test(s) passed in ${sections.length} check(s)` : "the spec has errors, so nothing was checked";
  out.push(`${r.ok ? OK : FAIL} **${head}**`, "");
  const a = r.affected;
  if (a) out.push(a.everything
    ? `<sub>Every check ran: since \`${esc(a.since)}\`, files no one node owns changed (${a.everything.slice(0, 3).map((f) => `\`${esc(f)}\``).join(", ")}${a.everything.length > 3 ? ", …" : ""}).</sub>`
    : a.nodes.length ? `<sub>Only the checks of what changed since \`${esc(a.since)}\` and what uses it: ${a.nodes.length} node(s).</sub>`
    : `<sub>Nothing changed since \`${esc(a.since)}\` reaches a node, so no tests ran; the spec and the build were still checked.</sub>`, "");
  if (!r.check) out.push("```", r.text.trim(), "```", "");
  for (const s of sections) {
    const ran = s.tests.length ? ` — ${s.tests.filter((t) => t.ok).length}/${s.tests.length} passed` : "";
    const pics = s.shots.length ? ` · ${s.shots.length} screen(s)` : "";
    out.push(`<details><summary>${s.ok ? OK : FAIL} <b>${esc(s.title)}</b>${ran}${pics}</summary>`, "");
    if (s.note) out.push(`<sub>${esc(s.note)}</sub>`, "");
    for (const x of s.problems) out.push("```", x.trim(), "```", "");
    const shown = new Set<string>();
    for (const t of s.tests) {
      out.push(`- ${t.ok ? OK : FAIL} ${esc(t.name)}`);
      const shot = s.shots.find((x) => x.test === t.name);
      const url = shot && link(shot.file);
      if (shot && url) { shown.add(shot.test); out.push("", `  <img src="${encodeURI(url)}" width="480" alt="${attr(t.name)}">`, ""); }
    }
    // Screens whose test is not in this run's results (say, the tests didn't run): still worth seeing.
    for (const shot of s.shots.filter((x) => !shown.has(x.test))) {
      const url = link(shot.file);
      if (url) out.push(`- 📷 ${esc(shot.test)}`, "", `  <img src="${encodeURI(url)}" width="480" alt="${attr(shot.test)}">`, "");
    }
    out.push("", "</details>");
  }
  if (r.e2e?.error) out.push("", `${FAIL} end-to-end checks (${esc(r.e2e.app)}): ${esc(r.e2e.error)}`);
  const tc = r.check?.verify.typecheck;
  if (tc) out.push("", `${tc.ok ? OK : FAIL} typecheck`, ...(tc.ok ? [] : ["", "```", tc.detail.trim(), "```"]));
  if (quiet) out.push("", `${OK} ${quiet} other node(s) built from the spec, importing only what they use (no tests of their own)`);
  if (r.check?.unjudged.length) out.push("", `${WARN} screens never compared with their look: ${r.check.unjudged.join(", ")}`);
  return out.join("\n") + "\n";
}

// --- one section per project in a pull request's description -------------------

const start = (project: string) => `<!-- ail-checks:${project} -->`;
const end = (project: string) => `<!-- /ail-checks:${project} -->`;

/** The description with this project's section replaced, or added at the end. */
export function upsertSection(body: string, project: string, section: string): string {
  const s = start(project), e = end(project);
  const block = `${s}\n${section.trim()}\n${e}`;
  const i = body.indexOf(s), j = body.indexOf(e, i);
  if (i >= 0 && j >= 0) return body.slice(0, i) + block + body.slice(j + e.length);
  return `${body.trimEnd()}${body.trim() ? "\n\n" : ""}${block}\n`;
}

/** Whether the description holds exactly this section for the project. */
export const hasSection = (body: string, project: string, section: string) => body.includes(`${start(project)}\n${section.trim()}\n${end(project)}`);

/** A section for a description, cut short to fit GitHub's limit alongside the rest. */
export function sectionFor(project: string, checks: string, max = 30000): string {
  let text = `### AIL checks · \`${project}\`\n\n${checks.trim()}`;
  if (text.length > max) text = text.slice(0, max).replace(/<details>(?![\s\S]*<\/details>)[\s\S]*$/, "") + "\n\n_Cut short; every check is in the job summary._";
  return text;
}

// --- for agents: the section, from the last build, linked to the pushed commit ---

/** Where a committed file can be seen on GitHub, at a commit; null when origin isn't on GitHub. */
export function githubLink(p: Project, sha: string): ((file: string) => string) | null {
  const origin = git(p.root, "remote", "get-url", "origin") ?? "";
  const m = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?\/?$/.exec(origin.replace(/^https?:\/\/[^@/]*@/, "https://"));
  const top = git(p.root, "rev-parse", "--show-toplevel");
  if (!m || !top) return null;
  return (file) => `https://github.com/${m[1]}/${m[2]}/blob/${sha}/${relative(top, file).split("\\").join("/")}?raw=true`;
}

/** The project's name in a description's markers: its folder in the repository, as the GitHub Action names it. */
export function projectKey(p: Project): string {
  const top = git(p.root, "rev-parse", "--show-toplevel");
  return (top && relative(top, p.root).split("\\").join("/")) || ".";
}

/**
 * The checks of the last build, as a section for a pull request's
 * description, between the markers the GitHub Action uses (so either can
 * replace the other's). Screens link to the committed screenshots at the
 * commit the build ran on, which must be pushed for them to show.
 */
/**
 * What a build writes and the person then commits: the proof screenshots (beside the spec, and the old
 * checks/shots/ they move out of) and the lock file. `file` is relative to the project.
 */
function isBuildOutput(p: Project, file: string): boolean {
  const rel = (f: string) => relative(p.root, f).split("\\").join("/");
  const lock = rel(lockPath(p)), legacy = rel(legacyShotsDir(p));
  return file === lock || file.startsWith(legacy + "/") || isShotFile(p, file);
}

/**
 * The commit that holds the screenshots of a build that ran on `head`: HEAD itself once the only commits since `head`
 * are the build's own output, committed as the skill says, else `head`.
 */
export function screensCommit(p: Project, head: string): string {
  const now = git(p.root, "rev-parse", "HEAD");
  if (!now || now === head || git(p.root, "merge-base", "--is-ancestor", head, now) === null) return head;
  const changed = git(p.root, "diff", "--name-only", "--relative", head, now, "--", ".");
  if (changed === null) return head;
  return changed.split("\n").filter(Boolean).every((f) => isBuildOutput(p, f)) ? now : head;
}

/** Whether any of the build's own output is not committed yet. */
function uncommittedOutputs(p: Project): boolean {
  // -z: paths as they are, never quoted; a rename lists both paths.
  const r = Bun.spawnSync(["git", "status", "--porcelain", "-z", "--untracked-files=all", "--", "."], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) return false;
  const base = relative(git(p.root, "rev-parse", "--show-toplevel") ?? p.root, p.root).split("\\").join("/");
  const entries = r.stdout.toString().split("\0");
  const paths: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    if (e.length < 4) continue;
    paths.push(e.slice(3));
    if (e[0] === "R" || e[0] === "C") paths.push(entries[++i] ?? ""); // the path it was renamed or copied from
  }
  return paths.filter(Boolean).some((f) => isBuildOutput(p, base && f.startsWith(base + "/") ? f.slice(base.length + 1) : f));
}

export function prSection(p: Project): string {
  const file = lastReportPath(p);
  if (!existsSync(file)) throw new Error("no build to show: run `ail build` first (`/ail:build`); its results are what this shows");
  const r = readReport(file);
  const notes: string[] = [];
  const at = r.head ? screensCommit(p, r.head) : undefined;
  const link = at ? githubLink(p, at) : null;
  if (!r.head) notes.push("not a git repository, so screens are not linked");
  else if (!link) notes.push("origin is not on GitHub, so screens are not linked");
  if (r.dirty) notes.push("the build ran on uncommitted changes: commit them, push, and build again, so the screens linked are the ones checked");
  else if (r.head && uncommittedOutputs(p)) notes.push("the screenshots the build took are not committed: commit and push them, or their links won't show");
  else if (at && !git(p.root, "branch", "-r", "--contains", at)) notes.push(`commit ${at.slice(0, 12)} is not pushed yet: push it, or its screens won't show`);
  const key = projectKey(p);
  const body = renderChecks(p, r, { link: link ?? (() => null) });
  const section = upsertSection("", key, sectionFor(key, body)).trim();
  return (notes.length ? notes.map((n) => `! ${n}`).join("\n") + "\n\n" : "") + section + "\n";
}
