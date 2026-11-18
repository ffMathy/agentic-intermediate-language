// Parser for `.ail.md` files.
//
// Only fenced code blocks tagged `ail` carry meaning; everything else in the
// Markdown file is commentary for humans. Inside a block, every line at
// column 0 starts a statement (`node`, `profile`, `catalog`, `glossary`,
// `jargon`, `use`), and indented lines form its body. A body is a list of
// sections: a keyword at the body's base indent followed by more-indented
// continuation lines.

export type Level = "product" | "experience" | "system" | "specialist";
export const LEVELS: Level[] = ["product", "experience", "system", "specialist"];

export interface Section {
  key: string;
  inline: string;
  /** Continuation lines, comments stripped, dedented to their common indent. */
  body: string[];
  /** Original lines (with comments), for faithful rendering. */
  raw: string[];
  line: number;
}

/** An indented item: a head line plus everything indented below it. */
export interface Item {
  head: string;
  children: string[];
  line: number;
}

export interface Scenario { title: string; steps: string[]; line: number }
export interface Example { expr: string; expected: string; line: number }
export interface Claim { text: string; refs: string[]; line: number }
export interface Rejected { alternative: string; because: string }
export interface Decision { what: string; because: string; rejected: Rejected[]; line: number }

export interface AilNode {
  name: string;
  kind: string;
  level: Level | null;
  tags: string[];
  file: string;
  line: number;
  sections: Section[];
  raw: string[];
  why: { text: string; ref: string | null } | null;
  claims: Claim[];
  scenarios: Scenario[];
  examples: Example[];
  probes: { expr: string; line: number }[];
  decisions: Decision[];
  children: string[];
  uses: string[];
  free: string[];
  entry: string | null;
}

export interface Term { term: string; plain: string; formal: string; line: number }

export interface ParsedFile {
  file: string;
  nodes: AilNode[];
  uses: { profile: string; line: number }[];
  profiles: { id: string; settings: Record<string, string>; order: string[]; line: number }[];
  catalogs: { tokens: Record<string, string>; components: string[]; line: number }[];
  glossary: Term[];
  jargon: string[];
  errors: { file: string; line: number; message: string }[];
}

export const NODE_SECTIONS = new Set([
  "why", "what", "how", "look", "copy", "binds", "free", "children", "uses", "verify", "entry",
]);

/** Strip a `;` comment that is outside double quotes and starts a word. */
export function stripComment(line: string): string {
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ";" && !inQuote && (i === 0 || /\s/.test(line[i - 1]!))) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

export const indentOf = (line: string) => line.length - line.trimStart().length;

function dedent(lines: string[]): string[] {
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  if (nonEmpty.length === 0) return [];
  const min = Math.min(...nonEmpty.map(indentOf));
  return lines.map((l) => (l.trim() === "" ? "" : l.slice(min))).filter((l) => l !== "");
}

/** Extract `ail` fenced blocks: returns [firstContentLineNumber, lines]. */
export function extractBlocks(markdown: string): { line: number; lines: string[] }[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: { line: number; lines: string[] }[] = [];
  let i = 0;
  while (i < lines.length) {
    const open = /^(`{3,}|~{3,})\s*ail\b/.exec(lines[i]!);
    if (!open) { i++; continue; }
    const fence = open[1]!;
    const start = i + 1;
    i++;
    const body: string[] = [];
    while (i < lines.length && !lines[i]!.startsWith(fence)) body.push(lines[i++]!);
    i++; // skip closing fence
    blocks.push({ line: start + 1, lines: body });
  }
  return blocks;
}

/** Split body lines into sections at the base indent. */
export function parseSections(body: { text: string; raw: string; line: number }[]): Section[] {
  const meaningful = body.filter((b) => b.text.trim() !== "");
  if (meaningful.length === 0) return [];
  const base = Math.min(...meaningful.map((b) => indentOf(b.text)));
  const sections: Section[] = [];
  let current: Section | null = null;
  let pending: string[] = [];
  const flush = () => {
    if (current) current.body = dedent(pending);
    pending = [];
  };
  for (const b of body) {
    if (b.text.trim() === "") { if (current) current.raw.push(b.raw); continue; }
    if (indentOf(b.text) === base) {
      flush();
      const t = b.text.trim();
      const m = /^(\S+)\s*(.*)$/.exec(t)!;
      current = { key: m[1]!, inline: m[2]!.trim(), body: [], raw: [b.raw], line: b.line };
      sections.push(current);
    } else if (current) {
      pending.push(b.text);
      current.raw.push(b.raw);
    }
  }
  flush();
  return sections;
}

/** Group dedented lines into items (a column-0 head plus its deeper lines). */
export function itemsOf(lines: string[], firstLine = 0): Item[] {
  const items: Item[] = [];
  lines.forEach((l, idx) => {
    if (indentOf(l) === 0 || items.length === 0) items.push({ head: l.trim(), children: [], line: firstLine + idx });
    else items[items.length - 1]!.children.push(l);
  });
  return items.map((it) => ({ ...it, children: dedent(it.children) }));
}

export const sectionLines = (s: Section) => (s.inline ? [s.inline, ...s.body] : s.body);
export const sectionText = (s: Section) => sectionLines(s).map((l) => l.trim()).join(" ");

const splitList = (s: string) => s.replace(/[\[\]]/g, " ").split(/[\s,]+/).filter(Boolean);

function parseNode(header: string, sections: Section[], file: string, line: number, raw: string[]): AilNode {
  // node <Name> : <kind> [level: <level>] [@tag ...]
  const m = /^node\s+([A-Za-z_][\w]*)\s*(?::\s*([\w-]+))?(.*)$/.exec(header);
  if (!m) throw new Error(`malformed node header: "${header}"`);
  const rest = m[3] ?? "";
  const level = /level:\s*(\w+)/.exec(rest)?.[1] ?? null;
  const tags = [...rest.matchAll(/@([\w.-]+)/g)].map((t) => t[1]!);
  const get = (k: string) => sections.find((s) => s.key === k);

  const node: AilNode = {
    name: m[1]!, kind: m[2] ?? "node", level: (level as Level) ?? null, tags, file, line, sections, raw,
    why: null, claims: [], scenarios: [], examples: [], probes: [], decisions: [],
    children: [], uses: [], free: [], entry: null,
  };

  const why = get("why");
  if (why) {
    const text = sectionText(why);
    node.why = { text, ref: /<-\s*([A-Za-z_]\w*)/.exec(text)?.[1] ?? null };
  }
  const what = get("what");
  if (what) {
    for (const it of itemsOf(sectionLines(what), what.line + 1)) {
      const sc = /^Scenario:\s*(.*)$/.exec(it.head);
      if (sc) { node.scenarios.push({ title: sc[1]!, steps: it.children.map((c) => c.trim()), line: it.line }); continue; }
      if (it.head === "examples") {
        it.children.filter((c) => indentOf(c) === 0).forEach((c, i) => {
          const at = c.lastIndexOf(" => ");
          node.examples.push(at < 0
            ? { expr: c.trim(), expected: "", line: it.line + 1 + i }
            : { expr: c.slice(0, at).trim(), expected: c.slice(at + 4).trim(), line: it.line + 1 + i });
        });
        continue;
      }
      if (it.head === "probes") {
        it.children.filter((c) => indentOf(c) === 0).forEach((c, i) => node.probes.push({ expr: c.trim(), line: it.line + 1 + i }));
        continue;
      }
      const all = [it.head, ...it.children].join(" ");
      const ref = /refined-by:\s*([\w\s,]+)$/.exec(all);
      if (ref) node.claims.push({ text: all.slice(0, ref.index).trim(), refs: splitList(ref[1]!), line: it.line });
    }
  }
  const how = get("how");
  if (how) {
    for (const it of itemsOf(sectionLines(how), how.line + 1)) {
      const d = /^decide\s+(.*)$/.exec(it.head);
      if (!d) continue;
      const dec: Decision = { what: d[1]!, because: "", rejected: [], line: it.line };
      let last: "because" | Rejected | null = null;
      for (const c of it.children.map((x) => x.trim())) {
        if (c.startsWith("because ")) { dec.because = c.slice(8).trim(); last = "because"; }
        else if (c.startsWith("rejected ")) {
          const body = c.slice(9);
          const at = body.indexOf(" because ");
          const r = at < 0 ? { alternative: body.trim(), because: "" } : { alternative: body.slice(0, at).trim(), because: body.slice(at + 9).trim() };
          dec.rejected.push(r); last = r;
        } else if (last === "because") dec.because += " " + c;
        else if (last) last.because = (last.because + " " + c).trim();
      }
      node.decisions.push(dec);
    }
  }
  for (const k of ["children", "uses", "free"] as const) {
    const s = get(k);
    if (s) node[k] = k === "free" ? sectionText(s).replace(/^\[|\]$/g, "").split(",").map((x) => x.trim()).filter(Boolean) : splitList(sectionText(s));
  }
  const entry = get("entry");
  if (entry) node.entry = sectionText(entry);
  return node;
}

export function parseFile(file: string, markdown: string): ParsedFile {
  const out: ParsedFile = { file, nodes: [], uses: [], profiles: [], catalogs: [], glossary: [], jargon: [], errors: [] };
  for (const block of extractBlocks(markdown)) {
    // split into statements at column 0
    const stmts: { header: string; line: number; body: { text: string; raw: string; line: number }[]; raw: string[] }[] = [];
    block.lines.forEach((rawLine, idx) => {
      const lineNo = block.line + idx;
      const text = stripComment(rawLine);
      if (text.trim() === "") { stmts.at(-1)?.raw.push(rawLine); stmts.at(-1)?.body.push({ text: "", raw: rawLine, line: lineNo }); return; }
      if (indentOf(text) === 0) stmts.push({ header: text.trim(), line: lineNo, body: [], raw: [rawLine] });
      else if (stmts.length === 0) out.errors.push({ file, line: lineNo, message: "indented line outside of any statement" });
      else { stmts.at(-1)!.body.push({ text, raw: rawLine, line: lineNo }); stmts.at(-1)!.raw.push(rawLine); }
    });
    for (const st of stmts) {
      const word = st.header.split(/\s+/)[0];
      try {
        if (word === "node") out.nodes.push(parseNode(st.header, parseSections(st.body), file, st.line, trimTrailingBlank(st.raw)));
        else if (word === "use") {
          const m = /^use\s+profile\s+(\S+)$/.exec(st.header);
          if (!m) throw new Error(`expected "use profile <id>", got "${st.header}"`);
          out.uses.push({ profile: m[1]!, line: st.line });
        } else if (word === "profile") {
          const id = st.header.split(/\s+/)[1];
          if (!id) throw new Error("profile needs an id");
          const settings: Record<string, string> = {};
          const order: string[] = [];
          for (const s of parseSections(st.body)) { settings[s.key] = sectionText(s); order.push(s.key); }
          out.profiles.push({ id, settings, order, line: st.line });
        } else if (word === "catalog") {
          const tokens: Record<string, string> = {};
          const components: string[] = [];
          for (const s of parseSections(st.body)) {
            const words = sectionText(s).split(/\s+/).filter(Boolean);
            if (s.key === "tokens") for (const w of words) { const [k, v] = w.split("="); tokens[k!] = v ?? ""; }
            else if (s.key === "components") components.push(...words);
            else throw new Error(`unknown catalog section "${s.key}"`);
          }
          out.catalogs.push({ tokens, components, line: st.line });
        } else if (word === "glossary") {
          for (const b of st.body) {
            const t = b.text.trim();
            if (!t) continue;
            const m = /^term\s+(?:"([^"]+)"|(\S+))\s+plain\s+"([^"]*)"\s+formal\s+(.+)$/.exec(t);
            if (!m) { out.errors.push({ file, line: b.line, message: `malformed glossary term: "${t}"` }); continue; }
            out.glossary.push({ term: m[1] ?? m[2]!, plain: m[3]!, formal: m[4]!.trim(), line: b.line });
          }
        } else if (word === "jargon") {
          const text = [st.header.slice(6), ...st.body.map((b) => b.text)].join(" ");
          for (const m of text.matchAll(/"([^"]+)"|([^\s,"]+)/g)) out.jargon.push((m[1] ?? m[2]!).toLowerCase());
        } else {
          throw new Error(`unknown statement "${word}"`);
        }
      } catch (e) {
        out.errors.push({ file, line: st.line, message: (e as Error).message });
      }
    }
  }
  return out;
}

function trimTrailingBlank(lines: string[]): string[] {
  const out = [...lines];
  while (out.length && out.at(-1)!.trim() === "") out.pop();
  return out;
}
