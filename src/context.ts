// `ail context <Node>`: the encapsulated slice of the spec one compile step sees.
//
// Included: profile, catalog, glossary, the `why` chain of ancestors, the node
// itself, the `what` (contract) of every node it `uses`, and the profile's
// golden examples for the node's kind. Excluded: everything else, in
// particular any sibling's `how`. Encapsulation is enforced by construction.
import { dirname, relative } from "node:path";
import type { AilNode } from "./parse.ts";
import { ancestors, modulePath, type Project } from "./project.ts";
import { checkHeader, checkPath, derivedCheckFile, loadPrompt, needsDerivedCheck } from "./verify.ts";
import { oracleHash } from "./hash.ts";

function importSpecifier(fromPath: string, toPath: string): string {
  let rel = relative(dirname(fromPath), toPath).replace(/\.tsx?$/, "").replace(/(^|\/)index$/, "$1").replace(/\/$/, "");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

const fence = (body: string, lang = "ail") => "```" + lang + "\n" + body.trimEnd() + "\n```";

export function whatOnly(n: AilNode): string {
  const header = n.raw[0]!;
  const what = n.sections.find((s) => s.key === "what");
  return [header, ...(what?.raw ?? ["  ; (no public contract)"])].join("\n");
}

export function buildContext(p: Project, n: AilNode): string {
  const out: string[] = [];
  const path = modulePath(p, n);
  out.push(`# AIL compile context: ${n.name}`);
  out.push(`kind: ${n.kind} · level: ${n.level ?? "?"}${n.tags.length ? " · tags: " + n.tags.map((t) => "@" + t).join(" ") : ""}`);
  out.push(`output file: ${path ?? "(none — this node has no path in the profile)"}`);

  if (p.profile) {
    const pr = p.profile;
    out.push(`\n## Profile ${pr.id} (normative defaults)`);
    out.push(pr.order.map((k) => `- ${k}: ${pr.settings[k]}`).join("\n"));
    out.push(`\n## Catalog`);
    out.push(`tokens: ${Object.entries(p.tokens).map(([k, v]) => (v ? `${k}=${v}` : k)).join("  ")}`);
    out.push(`components: ${p.components.join("  ")}`);
    if (pr.skill) out.push(`\n## Profile idioms\n${pr.skill.replace(/^---[\s\S]*?---\s*/, "").trim()}`);
  }
  if (p.glossary.length) {
    out.push(`\n## Glossary`);
    out.push(p.glossary.map((t) => `- ${t.term}: ${t.plain} — formally ${t.formal}`).join("\n"));
  }

  const anc = ancestors(p, n.name);
  if (anc.length) {
    out.push(`\n## Why chain (root first; for intent and tie-breaking only)`);
    out.push(anc.map((a) => `- ${a.name}: ${a.why?.text ?? "(no why)"}`).join("\n"));
  }

  out.push(`\n## The node to implement`);
  out.push(fence(n.raw.join("\n")));

  const deps = n.uses.map((u) => p.nodes.get(u)).filter(Boolean) as AilNode[];
  if (deps.length) {
    out.push(`\n## Dependencies (contract only — their implementation is hidden on purpose)`);
    for (const d of deps) {
      const dp = modulePath(p, d);
      out.push(`\n### ${d.name}${dp && path ? ` — import from "${importSpecifier(path, dp)}"` : ""}`);
      out.push(fence(whatOnly(d)));
    }
  }
  const tokensCss = p.profile?.settings["tokens-css"];
  const catalogDir = p.profile?.settings["catalog-module"];
  if (path && (tokensCss || catalogDir)) {
    out.push(`\n## Shared modules`);
    if (catalogDir) out.push(`- catalog components: import { ... } from "${importSpecifier(path, catalogDir)}"`);
    if (tokensCss) out.push(`- design tokens are CSS variables defined in ${tokensCss}: token a.b.c → var(--a-b-c)`);
  }

  if (needsDerivedCheck(n)) {
    const { file, pinned } = derivedCheckFile(p, n);
    if (!file || pinned !== oracleHash(p, n).slice(0, 16)) {
      const rel = checkPath(p, n);
      out.push(`\n## Derived check needed`);
      out.push(`This node's scenarios / verify items have no current derived check. Write ${rel} as well, and submit it together with the module. It imports the module relative to itself and starts with the line:\n${checkHeader(p, n)}\n\n${loadPrompt("derive-checks")}`);
    }
  }

  const goldens = (p.profile?.goldens ?? []).filter((g) => g.kind === n.kind);
  if (goldens.length) {
    out.push(`\n## Golden examples for kind "${n.kind}" (match their structure and style exactly)`);
    for (const g of goldens) {
      out.push(`\n### ${g.name}`);
      out.push(g.il.trim());
      for (const [f, body] of Object.entries(g.files)) out.push(`\n${f}:\n` + fence(body, f.split(".").pop()));
    }
  }
  return out.join("\n") + "\n";
}

export { importSpecifier };
