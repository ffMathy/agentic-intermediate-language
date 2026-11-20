// The check that ends every `ail build`: is the spec
// sound, is the code built from it, and does the code do what it says?
// Read-only, and never calls a model.
import { relative } from "node:path";
import { staleGlue } from "./compile.ts";
import { nodeShotsDir, orphanShots, staleShots } from "./shots.ts";
import { lint, type Diagnostic } from "./lint.ts";
import { unjudged } from "./look.ts";
import { plan, type PlanEntry } from "./plan.ts";
import type { Project } from "./project.ts";
import { formatVerify, verifyProject, type VerifyResult, type Check } from "./verify.ts";

export interface CheckReport {
  ok: boolean;
  /** Model-free outputs (token CSS, spec module) that are out of date. */
  glue: string[];
  /** Built nodes with a look whose screens no model has compared with it yet. */
  unjudged: string[];
  lint: Diagnostic[];
  plan: PlanEntry[];
  verify: { results: VerifyResult[]; typecheck: Check | null; ok: boolean };
}

export function runCheck(p: Project, nodes: string[] = []): CheckReport {
  const l = lint(p);
  const pl = plan(p);
  const v = verifyProject(p, nodes);
  // Model-free outputs: the glue, and the committed proof screenshots.
  const glue = [
    ...staleGlue(p),
    ...staleShots(p).filter((n) => !nodes.length || nodes.includes(n.name)).map((n) => relative(p.root, nodeShotsDir(p, n))),
    ...orphanShots(p).map((d) => relative(p.root, d)),
  ];
  const ok = !l.some((d) => d.severity === "error") && pl.every((e) => e.status === "fresh") && !glue.length && v.ok;
  const looks = unjudged(p).filter((n) => !nodes.length || nodes.includes(n));
  return { ok, glue, unjudged: looks, lint: l, plan: pl, verify: v };
}

export function formatCheck(r: CheckReport): string {
  const out: string[] = [];
  const errors = r.lint.filter((d) => d.severity === "error");
  const warnings = r.lint.filter((d) => d.severity === "warning");
  out.push(errors.length ? `✗ spec     ${errors.length} error(s)` : `✓ spec     no errors${warnings.length ? `, ${warnings.length} warning(s)` : ""}`);
  for (const d of [...errors, ...warnings]) out.push(`    ${d.severity === "error" ? "✗" : "!"} ${d.file}:${d.line} ${d.code}: ${d.message}`);

  const todo = r.plan.filter((e) => e.status !== "fresh");
  out.push(todo.length || r.glue.length ? `✗ build    ${todo.length + r.glue.length} output(s) not built from the current spec — run \`ail build\`` : `✓ build    ${r.plan.length} node(s) up to date`);
  for (const e of todo) out.push(`    ${e.node} ${e.status}${e.reason ? ` (${e.reason})` : ""}`);
  for (const g of r.glue) out.push(`    ${g} out of date (written by ail build${g.includes("shots") ? ", which takes the proof screenshots" : " without a model"})`);

  const failed = r.verify.results.filter((x) => !x.ok);
  const tests = r.verify.results.flatMap((x) => x.checks).filter((c) => c.kind === "tests" && c.ok).reduce((n, c) => n + (Number(/\d+/.exec(c.detail)?.[0]) || 0), 0);
  const tc = r.verify.typecheck;
  if (failed.length || (tc && !tc.ok)) {
    out.push(`✗ behavior ${failed.length} node(s) failed${tc && !tc.ok ? ", typecheck failed" : ""}`);
    out.push(formatVerify({ results: failed, typecheck: tc && !tc.ok ? tc : null, ok: false }).split("\n").filter((l) => l && !/^(verification|all checks)/.test(l)).map((l) => "    " + l).join("\n"));
  } else out.push(`✓ behavior ${tests} test(s) passed${tc ? ", typecheck ok" : ""}`);
  const warn = r.verify.results.flatMap((x) => x.checks.filter((c) => !c.ok && c.severity === "warning").map((c) => `    ! ${x.node} ${c.kind}: ${c.detail}`));
  out.push(...warn);
  if (r.unjudged.length) out.push(`! look     ${r.unjudged.length} node(s) whose screens were never compared with their look — \`ail build\` compares them: ${r.unjudged.join(", ")}`);
  return out.join("\n");
}
