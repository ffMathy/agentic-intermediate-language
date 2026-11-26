// The checks of a build, for a pull request's description: one collapsible
// section per check (a node's tests, a flow's end-to-end check), each test
// with a check mark or a cross, and under it the screen it ended on when
// there is one. `ail build --report` writes the build's results as JSON; this
// renders them, and keeps one section per project in a description.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { AdoptReport } from "./adopt.ts";
import type { CheckReport } from "./check.ts";
import type { Project } from "./project.ts";
import { nodeShotsDir, readShotsIndex, shotsDir, type Shot } from "./shots.ts";
import type { TestResult } from "./verify.ts";

export interface BuildReport { ok: boolean; check: CheckReport | null; e2e: AdoptReport | null; text: string }

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
export function renderChecks(p: Project, r: BuildReport, opts: { shots?: Shot[]; outDir?: string; base?: string } = {}): string {
  const link = (file: string): string | null => {
    if (!opts.outDir || !opts.base || !existsSync(file)) return null;
    let rel = relative(opts.outDir, file);
    if (rel.startsWith("..")) {
      // A committed screenshot: published next to the fresh ones.
      rel = join("checks", relative(shotsDir(p), file));
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
