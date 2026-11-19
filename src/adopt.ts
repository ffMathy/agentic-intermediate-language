// `ail adopt`: prove that a spec describes a running app.
//
// Bringing an existing app under AIL means writing its spec from what people
// say (the why), what the app does (the what) and what the code decides (the
// how). End-to-end checks, one file per node, drive the real app in a browser
// through the node's scenarios. `ail adopt --app <url>` runs them against any
// running app: the legacy one, to prove the spec is right, and later the one
// `ail build` made, to prove it behaves the same.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { oracleHash } from "./hash.ts";
import type { AilNode } from "./parse.ts";
import { kebab, type Project } from "./project.ts";
import { checkHeader, checksDir, errorExcerpt, runBunTest } from "./verify.ts";

/** Where a node's end-to-end check lives: checks/e2e/<dir>/<kebab>.e2e.ts (not picked up by a plain `bun test`). */
export const e2eCheckPath = (p: Project, n: AilNode) => join(checksDir(p), "e2e", n.dir, `${kebab(n.name)}.e2e.ts`);

/** Nodes whose scenarios a person could play through in the app: its flows and the root. */
export const observable = (n: AilNode) => n.scenarios.length > 0 && (n.kind === "flow" || n.kind === "system");

export interface AdoptResult { node: string; file: string | null; status: "pass" | "fail" | "stale" | "missing"; detail: string }

/**
 * Run every end-to-end check (or those of `names`) against the app at `app`.
 * A check without a pin is pinned to the node's current spec on its first run;
 * one pinned to an older spec is reported stale and not run.
 */
export function adopt(p: Project, app: string, names: string[] = []): { ok: boolean; results: AdoptResult[] } {
  const results: AdoptResult[] = [];
  for (const n of p.ordered.filter((x) => !names.length || names.includes(x.name))) {
    const abs = e2eCheckPath(p, n);
    const file = relative(p.root, abs);
    if (!existsSync(abs)) {
      if (observable(n)) results.push({ node: n.name, file: null, status: "missing", detail: `no end-to-end check at ${file}` });
      continue;
    }
    let text = readFileSync(abs, "utf8");
    const pinned = /^\/\/ ail-derived-from:\s*\w+@([0-9a-f]+)/.exec(text)?.[1];
    if (!pinned) writeFileSync(abs, (text = `${checkHeader(p, n)}\n${text}`));
    else if (pinned !== oracleHash(p, n).slice(0, 16)) {
      results.push({ node: n.name, file, status: "stale", detail: "the node's spec changed since this check was written; update the check, then run again" });
      continue;
    }
    // Run from outside the project, so its test setup (a simulated DOM) stays out of a real browser's way.
    const r = runBunTest(tmpdir(), [abs], { AIL_APP_URL: app });
    results.push(r.ok
      ? { node: n.name, file, status: "pass", detail: `${r.passes} scenario(s) behave as specified` }
      : { node: n.name, file, status: "fail", detail: `${r.failures.length ? r.failures.join("; ") : "the check did not run"}\n${errorExcerpt(r.output, 20)}` });
  }
  return { ok: results.every((r) => r.status === "pass" || r.status === "missing"), results };
}

export function formatAdopt(app: string, r: { ok: boolean; results: AdoptResult[] }): string {
  const icon = { pass: "✓", fail: "✗", stale: "!", missing: "·" };
  const ran = r.results.filter((x) => x.status !== "missing");
  const missing = r.results.filter((x) => x.status === "missing");
  const lines = [`${r.ok ? "✓" : "✗"} app      ${ran.filter((x) => x.status === "pass").length} of ${ran.length} node(s) behave as their spec says at ${app}`];
  for (const x of ran.filter((y) => y.status !== "pass")) lines.push(`    ${icon[x.status]} ${x.node} ${x.status}: ${x.detail.split("\n").join("\n      ")}`);
  if (missing.length) lines.push(`    · ${missing.length} node(s) with scenarios have no end-to-end check yet: ${missing.map((x) => x.node).join(", ")}`);
  return lines.join("\n");
}
