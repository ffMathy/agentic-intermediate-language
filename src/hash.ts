// Canonical forms and content hashes.
//
// Hashes ignore comments, blank lines, indentation width, section order and
// runs of whitespace outside string literals. Two IL texts with the same
// meaning hash the same, so cosmetic edits never trigger recompilation.
import { createHash } from "node:crypto";
import type { AilNode, Section } from "./parse.ts";
import { ancestors, modulePath, type Project } from "./project.ts";

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function normalizeLine(line: string): string {
  let out = "";
  let inQuote = false;
  let lastSpace = false;
  for (const ch of line.trim()) {
    if (ch === '"') inQuote = !inQuote;
    if (!inQuote && /\s/.test(ch)) { if (!lastSpace) out += " "; lastSpace = true; continue; }
    lastSpace = false;
    out += ch;
  }
  return out;
}

export function canonicalSection(s: Section): string {
  // keep relative nesting (2 spaces per level) but normalise everything else
  const lines = (s.inline ? [s.inline, ...s.body] : s.body).map((l) => {
    const depth = Math.round((l.length - l.trimStart().length) / 2);
    return "  ".repeat(depth) + normalizeLine(l);
  });
  return `${s.key}\n${lines.join("\n")}`;
}

export function canonicalNode(n: AilNode, only?: string[]): string {
  const sections = n.sections
    .filter((s) => !only || only.includes(s.key))
    .map(canonicalSection)
    .sort();
  return [`node ${n.name} : ${n.kind} level:${n.level ?? "-"} ${[...n.tags].sort().map((t) => "@" + t).join(" ")}`.trim(), ...sections].join("\n");
}

/** The public contract of a node: what dependants are allowed to see — its
 * observable behaviour, and (for views and flows) the props it binds. */
export const contractOf = (n: AilNode) => canonicalNode(n, ["what", "binds"]);

export function profileHash(p: Project): string {
  if (!p.profile) return sha256("no-profile");
  const pr = p.profile;
  return sha256(JSON.stringify({
    id: pr.id,
    settings: pr.order.map((k) => [k, pr.settings[k]]),
    tokens: Object.entries(p.tokens).sort(),
    components: [...p.components].sort(),
    goldens: pr.goldens.map((g) => [g.name, g.il, Object.entries(g.files)]),
    skill: pr.skill,
  }));
}

/**
 * The compile hash of a node: everything that goes into its compile context.
 * Changing a dependency's `how` does NOT change it (encapsulation); changing
 * its `what` does.
 */
export function compileHash(p: Project, n: AilNode): string {
  const deps = n.uses.map((u) => p.nodes.get(u)).filter(Boolean) as AilNode[];
  return sha256([
    "ail-compile-v1",
    profileHash(p),
    JSON.stringify(p.glossary.map((t) => [t.term, t.plain, t.formal])),
    ...ancestors(p, n.name).map((a) => canonicalNode(a, ["why"])),
    canonicalNode(n),
    `at ${modulePath(p, n) ?? "-"}`,
    ...deps.map((d) => `${contractOf(d)}\nat ${modulePath(p, d) ?? "-"}`).sort(),
  ].join("\n---\n"));
}

/** Hash of what a node's derived checks were generated from. */
export function oracleHash(p: Project, n: AilNode): string {
  const deps = n.uses.map((u) => p.nodes.get(u)).filter(Boolean) as AilNode[];
  return sha256([
    "ail-oracle-v1",
    canonicalNode(n, ["what", "look", "copy", "binds", "verify"]),
    ...deps.map(contractOf).sort(),
  ].join("\n---\n"));
}
