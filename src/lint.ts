// `ail lint`: structural, traceability and readability rules.
import { LEVELS, NODE_SECTIONS, type AilNode, type Level } from "./parse.ts";
import { ancestors, descendants, isCompilable, modulePath, type Project } from "./project.ts";

export type Severity = "error" | "warning";
export interface Diagnostic { severity: Severity; code: string; message: string; node?: string; file: string; line: number }

const levelIdx = (l: Level | null) => (l ? LEVELS.indexOf(l) : 2);

/** Sections that may carry technical notation even at plain-language levels. */
const NOTATION_SECTIONS = new Set(["look", "copy", "binds", "uses", "children", "free", "entry"]);

/** Strip quoted strings, `<- Ref` links and `refined-by:` lists before vocabulary scanning. */
function plainText(line: string): string {
  return line.replace(/"[^"]*"/g, " ").replace(/<-\s*[\w.\[\]]+/g, " ").replace(/refined-by:.*$/, " ");
}

const CODE_PATTERNS: [RegExp, string][] = [
  [/\b[a-z]+[A-Z]\w*\b/, "camelCase identifier"],
  [/\b\w+\(/, "function call"],
  [/=>|:=|==|!=|&&|\|\|/, "operator"],
  [/\w\[\w*\]/, "indexing"],
  [/[{}]/, "braces"],
];

export function lint(p: Project): Diagnostic[] {
  const d: Diagnostic[] = [];
  const push = (severity: Severity, code: string, n: AilNode | null, message: string, line?: number, file?: string) =>
    d.push({ severity, code, message, node: n?.name, file: file ?? n?.file ?? "", line: line ?? n?.line ?? 0 });

  for (const e of p.errors) d.push({ severity: "error", code: "parse", message: e.message, file: e.file, line: e.line });

  if (!p.profile && p.nodes.size) push("warning", "no-profile", null, "no `use profile <id>` statement; nothing can be compiled", 1, p.files[0]?.file);

  const glossaryWords = new Set(p.glossary.map((t) => t.term.toLowerCase()));
  const tokenFamilies = new Set(Object.keys(p.tokens).map((t) => t.split(".")[0]!));
  const componentFamilies = new Set(p.components.map((c) => c.split(".")[0]!));
  const multiParent = new Map<string, string[]>();
  for (const n of p.nodes.values()) for (const c of n.children) multiParent.set(c, [...(multiParent.get(c) ?? []), n.name]);

  for (const n of p.ordered) {
    const lvl = levelIdx(n.level);
    const anc = ancestors(p, n.name);
    const isRoot = !p.parent.has(n.name);

    if (!n.level) push("error", "missing-level", n, `node ${n.name} has no level (one of ${LEVELS.join(", ")})`);
    else if (!LEVELS.includes(n.level)) push("error", "bad-level", n, `unknown level "${n.level}"`);

    for (const s of n.sections) if (!NODE_SECTIONS.has(s.key)) push("warning", "unknown-section", n, `unknown section "${s.key}"`, s.line);

    // --- tree shape -------------------------------------------------------
    for (const c of n.children) if (!p.nodes.has(c)) push("error", "unknown-node", n, `child "${c}" is not defined`);
    for (const u of n.uses) if (!p.nodes.has(u)) push("error", "unknown-node", n, `uses "${u}", which is not defined`);
    const parents = multiParent.get(n.name) ?? [];
    if (parents.length > 1) push("error", "multiple-parents", n, `${n.name} is a child of ${parents.join(" and ")}; a node has exactly one parent (use \`uses\` for dependencies)`);
    const par = p.parent.get(n.name);
    if (par) {
      const pn = p.nodes.get(par)!;
      if (lvl < levelIdx(pn.level)) push("error", "level-order", n, `${n.name} (${n.level}) is less detailed than its parent ${pn.name} (${pn.level}); levels may only deepen`);
    }

    // --- why traceability -------------------------------------------------
    if (!n.why) push(lvl <= 1 ? "error" : "warning", "missing-why", n, `${n.name} has no \`why\``);
    else if (n.why.ref) {
      if (!p.nodes.has(n.why.ref)) push("error", "bad-why-ref", n, `why points to unknown node "${n.why.ref}"`);
      else if (!anc.some((a) => a.name === n.why!.ref)) push("error", "bad-why-ref", n, `why points to ${n.why.ref}, which is not an ancestor of ${n.name}`);
    } else if (!isRoot) push("warning", "orphan-why", n, `${n.name}'s why does not trace to an ancestor (add "<- ${anc.at(-1)?.name ?? "Parent"}")`);

    // --- refinement -------------------------------------------------------
    if (n.level === "product") {
      const what = n.sections.find((s) => s.key === "what");
      const lines = what ? (what.inline ? [what.inline, ...what.body] : what.body) : [];
      const claimCount = lines.filter((l) => /^\S/.test(l)).length;
      if (claimCount > n.claims.length) push("error", "missing-refinement", n, `every product-level claim needs "refined-by: <Node>" (${claimCount - n.claims.length} without)`);
      for (const k of ["how", "look", "binds", "copy"]) if (n.sections.some((s) => s.key === k)) push("error", "plain-level-detail", n, `product-level nodes state outcomes only; move \`${k}\` into a child`);
    }
    const desc = descendants(p, n.name);
    for (const c of n.claims) for (const r of c.refs) {
      if (!p.nodes.has(r)) push("error", "bad-refinement", n, `refined-by "${r}" is not defined`, c.line);
      else if (!desc.has(r)) push("error", "bad-refinement", n, `refined-by ${r}, which is not a descendant of ${n.name}`, c.line);
    }

    // --- vocabulary per level ----------------------------------------------
    if (lvl <= 1) {
      for (const s of n.sections) {
        if (NOTATION_SECTIONS.has(s.key)) continue;
        const lines = s.inline ? [s.inline, ...s.body] : s.body;
        lines.forEach((raw, i) => {
          const line = plainText(raw);
          for (const j of p.jargon) {
            if (glossaryWords.has(j)) continue;
            if (new RegExp(`\\b${j.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(line))
              push("error", "jargon", n, `"${j}" is jargon at the ${n.level} level; use a glossary term or move it to a deeper node`, s.line + i);
          }
          for (const [re, what] of CODE_PATTERNS) {
            const m = re.exec(line);
            if (m) { push("error", "code-in-plain-level", n, `${what} "${m[0]}" in ${s.key} at the ${n.level} level; keep notation in look/binds or a deeper node`, s.line + i); break; }
          }
        });
      }
    }

    // --- catalog references -----------------------------------------------
    for (const s of n.sections.filter((x) => x.key === "look")) {
      const text = [s.inline, ...s.body].join(" ").replace(/"[^"]*"/g, " ");
      for (const m of text.matchAll(/\b([a-z][a-z0-9]*(?:\.[a-z0-9]+)+)\b/g)) {
        const t = m[1]!;
        if (tokenFamilies.has(t.split(".")[0]!) && !(t in p.tokens)) push("error", "unknown-token", n, `design token "${t}" is not in the catalog`, s.line);
      }
      for (const m of text.matchAll(/\b([A-Z][A-Za-z]*(?:\.[a-z0-9]+)+)\b/g)) {
        const c = m[1]!;
        if (componentFamilies.has(c.split(".")[0]!) && !p.components.includes(c)) push("error", "unknown-component", n, `component "${c}" is not in the catalog`, s.line);
      }
    }

    // --- executable checks ------------------------------------------------
    for (const e of n.examples) if (!e.expected) push("error", "example-syntax", n, `example "${e.expr}" needs "=> expected"`, e.line);
    for (const dec of n.decisions) if (!dec.because) push("warning", "decision-without-because", n, `decision "${dec.what}" has no \`because\``, dec.line);

    if (p.profile && n.children.length === 0 && n.kind !== "system" && !modulePath(p, n))
      push("warning", "no-path", n, `leaf ${n.name} (kind ${n.kind}) has no path.${n.kind} in profile ${p.profile.id}; it will not be compiled`);
    if (p.profile && isCompilable(p, n) && n.examples.length === 0 && n.scenarios.length === 0 && !n.sections.some((s) => s.key === "verify") && n.kind !== "data")
      push("warning", "unverifiable", n, `${n.name} has no examples, scenarios or verify section; nothing proves the generated code right`);
    if (n.kind === "system" && n.entry && !p.nodes.has(n.entry)) push("error", "unknown-node", n, `entry "${n.entry}" is not defined`);
  }

  // --- cycles in uses --------------------------------------------------------
  const state = new Map<string, number>();
  const stack: string[] = [];
  const visit = (name: string) => {
    if (state.get(name) === 2) return;
    if (state.get(name) === 1) {
      const n = p.nodes.get(name)!;
      push("error", "cycle", n, `dependency cycle: ${[...stack.slice(stack.indexOf(name)), name].join(" -> ")}`);
      return;
    }
    state.set(name, 1); stack.push(name);
    for (const u of p.nodes.get(name)?.uses ?? []) if (p.nodes.has(u)) visit(u);
    stack.pop(); state.set(name, 2);
  };
  for (const n of p.nodes.values()) visit(n.name);

  return d.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

export function formatDiagnostics(d: Diagnostic[]): string {
  if (d.length === 0) return "✓ no problems";
  const lines = d.map((x) => `${x.file}:${x.line}  ${x.severity === "error" ? "error" : "warn "}  ${x.code.padEnd(22)} ${x.message}`);
  const e = d.filter((x) => x.severity === "error").length;
  lines.push(`\n${e} error(s), ${d.length - e} warning(s)`);
  return lines.join("\n");
}
