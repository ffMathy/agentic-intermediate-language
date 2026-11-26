// `ail lint`: structural, traceability and readability rules.
import { posix } from "node:path";
import { specFilesIn, specModuleProjects } from "./compile.ts";
import { itemsOf, LEVELS, NODE_SECTIONS, sectionLines, stripComment, type AilNode, type Level } from "./parse.ts";
import { ancestors, dependencies, descendants, isCompilable, isExisting, kebab, modulePath, PATH_PLACEHOLDERS, SHOTS, type Project } from "./project.ts";

export type Severity = "error" | "warning";
export interface Diagnostic { severity: Severity; code: string; message: string; node?: string; file: string; line: number }

/** Dotted names that are file names or products, not component variants (e.g. Node.js). */
const FILE_SUFFIX = /^(js|jsx|ts|tsx|css|html|md|json|io|com|org|dev|app)$/;

const kebabName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
const levelIdx = (l: Level | null) => (l ? LEVELS.indexOf(l) : 2);

/** Sections that may carry technical notation even at plain-language levels. */
const NOTATION_SECTIONS = new Set(["look", "copy", "binds", "uses", "children", "free", "entry"]);

/** Strip quoted strings, `<- Ref` links and `refined-by:` lists before vocabulary scanning. */
function plainText(line: string): string {
  return line.replace(/"[^"]*"/g, " ").replace(/<-\s*[\w.\[\]]+/g, " ").replace(/refined-by:.*$/, " ");
}

/**
 * Target-language syntax, which a spec never uses: AIL has its own notation
 * (docs/language.md) and every compiler translates it into its target's
 * conventions. Each entry is a pattern and the AIL way to say it instead.
 */
export const TARGET_SYNTAX: [RegExp, string, string][] = [
  [/\b[A-Z]\w*<\s*[A-Za-z][\w\s,.<>\[\]?]*>/, "generic type", "write `list of T`, `map of K to V`, `T or nothing`, or name the type"],
  [/\b\w+(\[\])+/, "array type", "write `list of T`"],
  [/(?::|->|=>|\|)\s*(string|int|bool|double|float|long|short|char|byte|void|any|object|unknown|undefined|unit|Unit|i32|i64|u8|f64|usize|str|Guid|DateTime|TimeSpan|Uri)\b(?!\s*\()/, "language type", "use AIL's types: text, number, integer, boolean, nothing, list of T, map of K to V"],
  [/\b(null|undefined|nil|None|NULL)\b/, "language null", "write `nothing`"],
  [/\b(interface|class|struct|enum|trait|protocol|namespace)\s+[A-Z]\w*|\b(public|private|protected|internal|static|readonly|override|abstract)\s+(static\s+|readonly\s+|async\s+)*[A-Za-z]\w*\s+[A-Za-z]\w*\s*[({;=]/, "declaration", "declare a type as `type Name = { field: Type, action(input: Type) -> Type }`"],
  [/\b(Task|Promise|Future|ValueTask|IAsyncEnumerable|IEnumerable|IList|IReadOnlyList|ICollection|List|Dictionary|HashMap|HashSet|ArrayList|Observable|Optional|Option|Result|Vec)\s*</, "platform type", "write `later T` for a result that arrives later, `list of T`, `map of K to V`, `T or nothing`"],
  [/(?:->|=>|:)\s*(Task|Promise|Future|ValueTask|Observable)\b/, "platform type", "write `later T` for a result that arrives later, or `later nothing`"],
  [/\(\s*(?:\w+|\(\s*\w+(?:\s*,\s*\w+)*\s*\))\s*=>/, "lambda", "say it in words, or give the function a name and an example"],
  [/\.(Select|Where|SelectMany|OrderBy|OrderByDescending|ToList|ToArray|ToDictionary|FirstOrDefault|Any|All|Count|map|filter|reduce|forEach|flatMap|find|findIndex|some|every|includes|push|splice|collect|iter)\(/, "collection method", "say it in words (\"the ids of all actions\"), or name a function in the spec"],
  [/===|!==|&&|\|\||(?<![=!<>])==(?!>)|!=(?!=)/, "operator", "write `is`, `is not`, `and`, `or`"],
  [/^\s*(const|let|var|val|auto|final|import|export|using|package|#include|from\s+\S+\s+import)\s/, "declaration", "AIL has no statements: state a constant as `NAME: Type = value`"],
  [/\buse(State|Effect|Ref|Memo|Callback|Context|Reducer|LayoutEffect)\b|\bReact\b|\bJSX\b|\bsetState\b|\bthis\.\w|\bself\.\w|\bnew\s+[A-Z]\w*\(/, "framework idiom", "say what is kept (`state  name: Type, starting at value`) and leave the framework to the target"],
];

/** Sections whose text is contract or decision, not visual description or provenance. */
const NEUTRAL_SECTIONS = new Set(["what", "how", "binds", "verify"]);

/** The first target-language construct in a spec line, if any (quoted text is ignored). */
export function targetSyntax(line: string, names: Set<string> = new Set()): { what: string; match: string; instead: string } | null {
  const text = line.replace(/"(?:[^"\\]|\\.)*"|“[^”]*”/g, '""');
  for (const [re, what, instead] of TARGET_SYNTAX) {
    const m = re.exec(text);
    if (!m) continue;
    // A type the spec itself defines as a node (say a `Task` in a to-do app) is the spec's own word.
    const word = /[A-Za-z]\w*/.exec(m[0])?.[0];
    if (what === "platform type" && word && names.has(word)) continue;
    return { what, match: m[0].trim(), instead };
  }
  return null;
}

/** Bare words that may head a group of lines in `what`. */
const WHAT_LABELS = new Set(["examples", "probes"]);

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
  // Each spec folder's shots/ holds its proof screenshots, so a spec can't live in one.
  for (const f of p.files) if (f.file.split(/[\\/]/).slice(0, -1).includes(SHOTS))
    push("error", "reserved-folder", null, `a spec file can't be in a folder called "${SHOTS}": that name is where each spec folder keeps its proof screenshots. Rename the folder`, 1, f.file);
  // One spec file per folder: the folder is the node's place, with room beside it for its screenshots (shots/).
  const byFolder = new Map<string, string[]>();
  for (const f of p.files) {
    const dir = posix.dirname(f.file.split("\\").join("/"));
    byFolder.set(dir, [...(byFolder.get(dir) ?? []), f.file]);
  }
  for (const [dir, files] of byFolder) {
    if (files.length < 2) continue;
    // The file named like its folder may stay; any other moves into a folder of its own.
    const own = files.find((f) => posix.basename(f, ".ail.md") === posix.basename(dir)) ?? files[0]!;
    for (const f of files.filter((x) => x !== own)) {
      const node = p.files.find((x) => x.file === f)?.nodes[0];
      const name = node ? kebab(node.name) : posix.basename(f, ".ail.md");
      push("error", "one-file-per-folder", node ?? null, `${f} shares its folder with ${own}: a folder holds one spec file, so each node has room for its screenshots. Move it into a folder of its own, ${posix.join(dir, name, name + ".ail.md")}`, 1, f);
    }
  }
  // One node per file: the file is the node's place, beside which its screenshots are kept.
  for (const f of p.files) for (const n of f.nodes.slice(1))
    push("error", "one-node-per-file", n, `${n.name} is not the only node in ${f.file}: a spec file holds one node. Move it into its own file, ${posix.join(posix.dirname(f.file), kebab(n.name) + ".ail.md")}`);

  if (p.config.specModule) for (const q of specModuleProjects(p))
    if (!specFilesIn(q.dir).length) push("error", "spec-module-empty", null, `specModule project "${q.key}": no *.ail.md files in ${q.configDir}, so the page would show an empty project`, 1, "ail.config.json");

  if (!p.target && p.nodes.size) push("error", "no-target", null, "no `target` block: nothing says what to generate, so nothing can be built", 1, p.files[0]?.file);
  if (p.target) {
    const t = p.target;
    // A placeholder ail doesn't fill would end up in a file name.
    for (const key of t.order.filter((k) => k.startsWith("path.") || k === "checks.path"))
      for (const m of t.settings[key]!.matchAll(/\{(\w+)\}/g))
        if (!(PATH_PLACEHOLDERS as readonly string[]).includes(m[1]!))
          push("error", "unknown-placeholder", null, `${key} uses {${m[1]}}, which ail does not fill in; a path may use ${PATH_PLACEHOLDERS.map((x) => `{${x}}`).join(", ")} ({name} is the node's name, in UpperCamelCase)`, t.line, t.file);
    if (!!t.settings["checks.path"] !== !!t.settings["checks.run"])
      push("error", "checks-incomplete", null, "a target that checks in its own language needs both `checks.path` (where a node's check goes) and `checks.run` (the command that runs it)", t.line, t.file);
  }

  const nodeNames = new Set(p.nodes.keys());
  const tokenFamilies = new Set(Object.keys(p.tokens).map((t) => t.split(".")[0]!));
  const multiParent = new Map<string, string[]>();
  for (const n of p.nodes.values()) for (const c of n.children) multiParent.set(c, [...(multiParent.get(c) ?? []), n.name]);

  for (const n of p.ordered) {
    const lvl = levelIdx(n.level);
    const anc = ancestors(p, n.name);
    const isRoot = !p.parent.has(n.name);

    if (!n.level) push("error", "missing-level", n, `node ${n.name} has no level (one of ${LEVELS.join(", ")})`);
    else if (!LEVELS.includes(n.level)) push("error", "bad-level", n, `unknown level "${n.level}"`);

    for (const s of n.sections) if (!NODE_SECTIONS.has(s.key)) push("error", "unknown-section", n, `unknown section "${s.key}"; a node's sections are ${[...NODE_SECTIONS].join(", ")} (docs/language.md)`, s.line);

    // --- one notation, whatever the target --------------------------------
    for (const s of n.sections) {
      if (!NEUTRAL_SECTIONS.has(s.key)) continue;
      s.raw.forEach((raw, i) => {
        const hit = targetSyntax(stripComment(i === 0 ? raw.trim().slice(s.key.length) : raw), nodeNames);
        if (hit) push("error", "target-syntax", n, `${hit.what} "${hit.match}" in ${s.key}: a spec is written in AIL notation, never in a target language's; ${hit.instead} (docs/language.md)`, s.line + i);
      });
    }
    const whatSec = n.sections.find((s) => s.key === "what");
    if (whatSec) for (const it of itemsOf(sectionLines(whatSec), whatSec.line + 1))
      if (/^[a-z]+$/.test(it.head) && it.children.length && !WHAT_LABELS.has(it.head))
        push("error", "unknown-label", n, `"${it.head}" is not part of AIL: in \`what\`, signatures, types and constants stand on their own lines (they are the node's exports), and the only labels are ${[...WHAT_LABELS].join(" and ")} (docs/language.md)`, it.line);

    // --- tree shape -------------------------------------------------------
    for (const c of n.children) if (!p.nodes.has(c)) push("error", "unknown-node", n, `child "${c}" is not defined`);
    for (const u of n.uses) if (!p.nodes.has(u)) push("error", "unknown-node", n, `uses "${u}", which is not defined`);
    const parents = multiParent.get(n.name) ?? [];
    if (parents.length > 1) push("error", "multiple-parents", n, `${n.name} is a child of ${parents.join(" and ")}; a node has exactly one owner. To share it, give it one owner (e.g. a \`library\` node) and let every area list it under \`uses\``);
    const par = p.parent.get(n.name);
    if (par) {
      const pn = p.nodes.get(par)!;
      if (lvl < levelIdx(pn.level)) push("error", "level-order", n, `${n.name} (${n.level}) is less detailed than its parent ${pn.name} (${pn.level}); levels may only deepen`);
      if (pn.dir && n.dir !== pn.dir && !n.dir.startsWith(pn.dir + "/"))
        push("warning", "misplaced-node", n, `${n.name} lives in "${n.dir || "."}" but its parent ${pn.name} lives in "${pn.dir}"; keep children in their parent's folder or below so the folders mirror the tree`);
    }
    if (n.kind === "library" && n.children.length === 0) push("warning", "empty-library", n, `library ${n.name} owns no children`);
    // Adopting an app leaves reasons nobody could confirm marked as such: keep them visible until an owner answers.
    for (const sec of n.sections) for (const [i, l] of sec.raw.entries())
      if (/confirm with the owner/i.test(l)) push("warning", "open-question", n, `${n.name} has a reason nobody has confirmed yet: ${l.trim()}`, sec.line + i);
    const maxLines = p.config.maxNodeLines ?? 80;
    const size = n.raw.filter((l) => l.trim() !== "").length;
    if (size > maxLines) push("warning", "node-too-large", n, `${n.name} spans ${size} lines (budget ${maxLines}); split it into children, each in a folder of its own inside ${n.dir ? n.dir + "/" : "the spec root"}`);

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
    // A claim is refined by a descendant, or by a shared node one of them uses.
    const desc = descendants(p, n.name);
    const reach = new Set(desc);
    for (const d of [n.name, ...desc]) for (const dep of dependencies(p, d)) reach.add(dep);
    for (const c of n.claims) for (const r of c.refs) {
      if (!p.nodes.has(r)) push("error", "bad-refinement", n, `refined-by "${r}" is not defined`, c.line);
      else if (!reach.has(r)) push("error", "bad-refinement", n, `refined-by ${r}, which is neither a descendant of ${n.name} nor used by one`, c.line);
    }

    // --- vocabulary per level ----------------------------------------------
    if (lvl <= 1) {
      for (const s of n.sections) {
        if (NOTATION_SECTIONS.has(s.key)) continue;
        const lines = s.inline ? [s.inline, ...s.body] : s.body;
        lines.forEach((raw, i) => {
          const line = plainText(raw);
          for (const [re, what] of CODE_PATTERNS) {
            const m = re.exec(line);
            if (m) { push("error", "code-in-plain-level", n, `${what} "${m[0]}" in ${s.key} at the ${n.level} level; keep notation in look/binds or a deeper node`, s.line + i); break; }
          }
        });
      }
    }

    // --- tokens and components ---------------------------------------------
    // A design token must be in the catalog. A component is just a node: a
    // look that shows `Button.primary` or `Stack` must use that node.
    const owners = new Set(anc.map((a) => a.name));
    const byLowerName = new Map([...p.nodes.keys()].map((k) => [k.toLowerCase(), k]));
    for (const s of n.sections.filter((x) => x.key === "look" || x.key === "binds")) {
      // Quoted text (straight, curly or single quotes) is copy, not a reference.
      const text = [s.inline, ...s.body].join(" ").replace(/"[^"]*"|“[^”]*”|‘[^’]*’|'[^']*'/g, " ");
      if (s.key === "look") for (const m of text.matchAll(/\b([a-z][a-z0-9]*(?:\.[a-z0-9]+)+)\b/g)) {
        const t = m[1]!;
        if (tokenFamilies.has(t.split(".")[0]!) && !(t in p.tokens)) push("error", "unknown-token", n, `design token "${t}" is not in the catalog`, s.line);
      }
      const named = new Set<string>();
      for (const m of text.matchAll(/\b([A-Z][A-Za-z0-9]*)((?:\.[a-z0-9]+)*)\b/g)) {
        const [whole, name, variants] = [m[0], m[1]!, m[2]!.split(".").filter(Boolean)];
        const target = p.nodes.get(name);
        if (target) {
          named.add(name);
          // `Button.primary` must name a variant the Button node itself mentions.
          const own = [...target.sections.filter((x) => ["look", "binds", "what"].includes(x.key)).flatMap((x) => [x.inline, ...x.body])].join(" ");
          for (const v of variants) if (s.key === "look" && !new RegExp(`\\b${v}\\b`).test(own))
            push("error", "unknown-variant", n, `"${whole}": ${name} mentions no "${v}" variant in its look, binds or what`, s.line);
        } else if (variants.length && s.key === "look" && !FILE_SUFFIX.test(variants.at(-1)!))
          push("error", "unknown-component", n, `"${whole}" names no node; components are nodes (e.g. a view in a \`library\`)`, s.line);
      }
      // Layout notation such as `stack(…)` names a node in lower case.
      for (const m of text.matchAll(/\b([a-z][a-zA-Z0-9]*)\(/g)) { const k = byLowerName.get(m[1]!.toLowerCase()); if (k) named.add(k); }
      for (const name of named) {
        // A node may mention its owners or its users without depending on them.
        if (name === n.name || owners.has(name) || dependencies(p, name).has(n.name)) continue;
        if (!n.uses.includes(name)) push("error", "missing-uses", n, `${s.key} refers to ${name}, but ${n.name} does not list it under \`uses\``, s.line);
      }
    }

    // --- executable checks ------------------------------------------------
    for (const e of n.examples) if (!e.expected) push("error", "example-syntax", n, `example "${e.expr}" needs "=> expected"`, e.line);
    for (const dec of n.decisions) if (!dec.because) push("warning", "decision-without-because", n, `decision "${dec.what}" has no \`because\``, dec.line);

    if (isExisting(n) && !n.sections.some((s) => s.key === "what" || s.key === "binds"))
      push("warning", "existing-without-contract", n, `${n.name} is @existing but states no \`what\`: the nodes that use it would see nothing of it`);
    if (p.target && n.children.length === 0 && n.kind !== "library" && !isExisting(n) && !modulePath(p, n))
      push("warning", "no-path", n, `leaf ${n.name} (kind ${n.kind}) has no path.${n.kind} in the target; it will not be built`);
    if (p.target && isCompilable(p, n) && n.examples.length === 0 && n.scenarios.length === 0 && !n.sections.some((s) => s.key === "verify") && n.kind !== "data" && n.kind !== "system")
      push("warning", "unverifiable", n, `${n.name} has no examples, scenarios or verify section; nothing proves the generated code right`);
    if (p.target && n.kind === "system" && n.entry && !modulePath(p, n))
      push("warning", "no-entry-path", n, `${n.name} has an entry but the target has no path.system, so no entry module will be built`);
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
