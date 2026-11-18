// Loads an AIL project: config, sources, the profile it uses, and the
// derived tree (children) and dependency graph (uses).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { parseFile, type AilNode, type ParsedFile, type Term } from "./parse.ts";

export const AIL_HOME = resolve(import.meta.dir, "..");

export interface Config {
  /** Lint warns when a node spans more lines than this (default 80): split it into children. */
  maxNodeLines?: number;
  sources?: string[];
  profilePaths?: string[];
  checksDir?: string;
  lockFile?: string;
  models?: string[];
}

export interface Golden { name: string; kind: string; il: string; files: Record<string, string> }

export interface Profile {
  id: string;
  dir: string;
  settings: Record<string, string>;
  order: string[];
  tokens: Record<string, string>;
  components: string[];
  jargon: string[];
  goldens: Golden[];
  skill: string;
}

export interface Project {
  root: string;
  config: Config;
  files: ParsedFile[];
  nodes: Map<string, AilNode>;
  ordered: AilNode[];
  parent: Map<string, string>;
  roots: AilNode[];
  profile: Profile | null;
  glossary: Term[];
  tokens: Record<string, string>;
  components: string[];
  jargon: string[];
  errors: { file: string; line: number; message: string }[];
}

export function findRoot(start = process.cwd()): string {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, "ail.config.json"))) return dir;
    const up = dirname(dir);
    if (up === dir) return resolve(start);
    dir = up;
  }
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".ail.md")) out.push(p);
  }
  return out;
}

export function loadProfile(id: string, searchPaths: string[]): Profile | null {
  for (const base of searchPaths) {
    const dir = join(base, id);
    const file = join(dir, "profile.ail.md");
    if (!existsSync(file)) continue;
    const parsed = parseFile(file, readFileSync(file, "utf8"));
    const p = parsed.profiles.find((x) => x.id === id);
    if (!p) continue;
    const tokens: Record<string, string> = {};
    const components: string[] = [];
    for (const c of parsed.catalogs) { Object.assign(tokens, c.tokens); components.push(...c.components); }
    const goldens: Golden[] = [];
    const gdir = join(dir, "golden");
    if (existsSync(gdir)) {
      for (const name of readdirSync(gdir).sort()) {
        const d = join(gdir, name);
        if (!statSync(d).isDirectory()) continue;
        const ilFile = join(d, "node.ail.md");
        if (!existsSync(ilFile)) continue;
        const il = readFileSync(ilFile, "utf8");
        const kind = parseFile(ilFile, il).nodes[0]?.kind ?? "node";
        const files: Record<string, string> = {};
        for (const f of readdirSync(d).sort()) if (f !== "node.ail.md") files[f] = readFileSync(join(d, f), "utf8");
        goldens.push({ name, kind, il, files });
      }
    }
    const skillFile = join(dir, "SKILL.md");
    return {
      id, dir, settings: p.settings, order: p.order, tokens, components, jargon: parsed.jargon, goldens,
      skill: existsSync(skillFile) ? readFileSync(skillFile, "utf8") : "",
    };
  }
  return null;
}

export function loadProject(rootArg?: string): Project {
  const root = rootArg ? resolve(rootArg) : findRoot();
  const cfgFile = join(root, "ail.config.json");
  const config: Config = existsSync(cfgFile) ? JSON.parse(readFileSync(cfgFile, "utf8")) : {};
  const sources = config.sources
    ? [...new Set(config.sources.flatMap((pattern) => [...new Bun.Glob(pattern).scanSync({ cwd: root })].filter((f) => !/(^|\/)(node_modules|\.[^/]+)\//.test(f)).map((f) => resolve(root, f))))].sort()
    : walk(root).sort();
  const files = sources.map((f) => parseFile(relative(root, f), readFileSync(f, "utf8")));
  const errors = files.flatMap((f) => f.errors);

  const nodes = new Map<string, AilNode>();
  for (const f of files) for (const n of f.nodes) {
    if (nodes.has(n.name)) errors.push({ file: n.file, line: n.line, message: `duplicate node "${n.name}"` });
    else nodes.set(n.name, n);
  }
  const parent = new Map<string, string>();
  for (const n of nodes.values()) for (const c of n.children) if (!parent.has(c)) parent.set(c, n.name);
  const roots = [...nodes.values()].filter((n) => !parent.has(n.name));

  // Depth-first order following `children`, so output is stable and readable.
  const ordered: AilNode[] = [];
  const seen = new Set<string>();
  const visit = (n: AilNode) => {
    if (seen.has(n.name)) return;
    seen.add(n.name); ordered.push(n);
    for (const c of n.children) { const cn = nodes.get(c); if (cn) visit(cn); }
  };
  roots.forEach(visit);
  for (const n of nodes.values()) visit(n);

  const profilePaths = [...(config.profilePaths ?? []).map((p) => resolve(root, p)), join(root, "profiles"), join(AIL_HOME, "profiles")];
  const use = files.flatMap((f) => f.uses)[0];
  const profile = use ? loadProfile(use.profile, profilePaths) : null;
  if (use && !profile) errors.push({ file: files.find((f) => f.uses.length)!.file, line: use.line, message: `profile "${use.profile}" not found in ${profilePaths.join(", ")}` });

  const tokens = { ...(profile?.tokens ?? {}) };
  const components = [...(profile?.components ?? [])];
  for (const f of files) for (const c of f.catalogs) { Object.assign(tokens, c.tokens); components.push(...c.components); }

  return {
    root, config, files, nodes, ordered, parent, roots, profile,
    glossary: files.flatMap((f) => f.glossary),
    tokens, components,
    jargon: [...(profile?.jargon ?? []), ...files.flatMap((f) => f.jargon)],
    errors,
  };
}

export const kebab = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

/** The module path a node compiles to, per the profile's `path.<kind>`. */
export function modulePath(p: Project, n: AilNode): string | null {
  const tpl = p.profile?.settings[`path.${n.kind}`];
  if (!tpl) return null;
  return posix.normalize(tpl.replace("{dir}", n.dir).replace("{kebab}", kebab(n.name)).replace("{name}", n.name));
}

/** Nodes the LLM compiles: those with a module path that aren't glue kinds. */
export function isCompilable(p: Project, n: AilNode): boolean {
  return modulePath(p, n) !== null && n.kind !== "system";
}

export function ancestors(p: Project, name: string): AilNode[] {
  const out: AilNode[] = [];
  let cur = p.parent.get(name);
  while (cur && !out.some((n) => n.name === cur)) {
    const n = p.nodes.get(cur);
    if (!n) break;
    out.unshift(n);
    cur = p.parent.get(cur);
  }
  return out;
}

export function descendants(p: Project, name: string): Set<string> {
  const out = new Set<string>();
  const stack = [...(p.nodes.get(name)?.children ?? [])];
  while (stack.length) {
    const c = stack.pop()!;
    if (out.has(c)) continue;
    out.add(c);
    stack.push(...(p.nodes.get(c)?.children ?? []));
  }
  return out;
}

/** Every node that depends on `name`, directly or through other nodes' `uses`. */
export function dependants(p: Project, name: string): AilNode[] {
  const out = new Set<string>();
  const stack = [name];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const n of p.nodes.values()) if (n.uses.includes(cur) && !out.has(n.name)) { out.add(n.name); stack.push(n.name); }
  }
  return p.ordered.filter((n) => out.has(n.name));
}

/** Every node a node depends on, directly or transitively. */
export function dependencies(p: Project, name: string): Set<string> {
  const out = new Set<string>();
  const stack = [...(p.nodes.get(name)?.uses ?? [])];
  while (stack.length) {
    const cur = stack.pop()!;
    if (out.has(cur)) continue;
    out.add(cur);
    stack.push(...(p.nodes.get(cur)?.uses ?? []));
  }
  return out;
}

/** Dependencies first (by `uses`), stable by tree order. Cycles are reported by lint. */
export function topoByUses(p: Project, subset?: AilNode[]): AilNode[] {
  const list = subset ?? p.ordered;
  const want = new Set(list.map((n) => n.name));
  const out: AilNode[] = [];
  const state = new Map<string, number>();
  const visit = (n: AilNode) => {
    if (state.get(n.name)) return;
    state.set(n.name, 1);
    for (const u of n.uses) { const d = p.nodes.get(u); if (d && want.has(d.name)) visit(d); }
    state.set(n.name, 2);
    out.push(n);
  };
  list.forEach(visit);
  return out;
}
