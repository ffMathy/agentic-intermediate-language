// Loads an AIL project: config, sources, its `target`, and the derived tree
// (children) and dependency graph (uses).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { parseFile, type AilNode, type ParsedFile, type Term } from "./parse.ts";

export const AIL_HOME = resolve(import.meta.dir, "..");

/** How to start an app and tell that it is ready. Any platform: a web server, a simulator, a CLI. */
export interface RunSpec {
  /** Shell command that starts the app, from `cwd`. Omit when the app is already running. */
  start?: string;
  /** Folder to start it from, relative to the project (default: the project). */
  cwd?: string;
  /** Ready when this URL answers, or when this shell command exits 0. Polled until `timeout`. */
  ready?: string;
  /** Seconds to wait for ready (default 120). */
  timeout?: number;
  /** Passed to the app, its seed and the end-to-end checks: how to reach the app (e.g. AIL_APP_URL, a device id). */
  env?: Record<string, string>;
  /** What the app needs running first, started in order and stopped after it: a backend, a database, a
   * queue. Each is started and awaited the same way; its env is passed on to the app, the seed and the checks. */
  services?: Record<string, RunSpec>;
  /** Shell command, from `cwd`, run once the app is ready: creates the data the checks need through the
   * program's official interface (its API, its CLI, its import), never by writing to its database. */
  seed?: string;
  /** Seconds the seed may take (default 120). */
  seedTimeout?: number;
}

export interface Config {
  /** Lint warns when a node spans more lines than this (default 80): split it into children. */
  maxNodeLines?: number;
  /** Folder that holds the spec (default "."). Node folders, and so the
   * generated code's folders, are measured from here. */
  specRoot?: string;
  /** Globs of spec files, relative to the project root (default: every .ail.md under specRoot). */
  sources?: string[];
  /** Where `ail build` writes spec files as data, for pages that show them: a
   * path (this project's spec), or a path plus the projects to include, each
   * with a key, a display name and its spec folder (relative to this project). */
  specModule?: string | { path: string; projects: { key: string; name: string; dir: string; shots?: boolean }[] };
  checksDir?: string;
  /** How to run apps for the end-to-end checks, found out by the agent that adopts or builds the project:
   * "legacy" is the existing app a spec is written from, "app" the one `ail build` makes. */
  run?: Record<string, RunSpec>;
  lockFile?: string;
  models?: string[];
}

/** What the code is generated for: the project's own conventions, written in its spec. */
export interface Target {
  settings: Record<string, string>;
  order: string[];
  file: string;
  line: number;
}

export interface Project {
  root: string;
  /** Absolute path of the folder that holds the spec. */
  specRoot: string;
  config: Config;
  files: ParsedFile[];
  nodes: Map<string, AilNode>;
  ordered: AilNode[];
  parent: Map<string, string>;
  roots: AilNode[];
  target: Target | null;
  glossary: Term[];
  tokens: Record<string, string>;
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

export function loadProject(rootArg?: string): Project {
  const root = rootArg ? resolve(rootArg) : findRoot();
  const cfgFile = join(root, "ail.config.json");
  const config: Config = existsSync(cfgFile) ? JSON.parse(readFileSync(cfgFile, "utf8")) : {};
  const specRoot = resolve(root, config.specRoot ?? ".");
  const sources = config.sources
    ? [...new Set(config.sources.flatMap((pattern) => [...new Bun.Glob(pattern).scanSync({ cwd: root })].filter((f) => !/(^|\/)(node_modules|\.[^/]+)\//.test(f)).map((f) => resolve(root, f))))].sort()
    : (existsSync(specRoot) ? walk(specRoot) : []).sort();
  const files = sources.map((f) => {
    const parsed = parseFile(relative(root, f), readFileSync(f, "utf8"));
    // Node folders are measured from the spec root, not the project root.
    const dir = relative(specRoot, dirname(f)).split("\\").join("/");
    for (const n of parsed.nodes) n.dir = dir.startsWith("..") ? n.dir : dir;
    return parsed;
  });
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

  const targets = files.flatMap((f) => f.targets.map((t) => ({ ...t, file: f.file })));
  for (const t of targets.slice(1)) errors.push({ file: t.file, line: t.line, message: `a project has one \`target\`; another is defined at ${targets[0]!.file}:${targets[0]!.line}` });
  const target = targets[0] ?? null;

  // A system node depends on its entry, so it may import it.
  for (const n of nodes.values()) if (n.entry && nodes.has(n.entry) && !n.uses.includes(n.entry)) n.uses.push(n.entry);

  const tokens: Record<string, string> = {};
  for (const f of files) for (const c of f.catalogs) Object.assign(tokens, c.tokens);

  return {
    root, specRoot, config, files, nodes, ordered, parent, roots, target,
    glossary: files.flatMap((f) => f.glossary),
    tokens,
    errors,
  };
}

/** The spec module's output path, if the project has one. */
export const specModulePath = (p: { config: Config }): string | null =>
  typeof p.config.specModule === "string" ? p.config.specModule : p.config.specModule?.path ?? null;

export const kebab = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

/** The module path a node compiles to, per the target's `path.<kind>`. */
export function modulePath(p: Project, n: AilNode): string | null {
  const tpl = p.target?.settings[`path.${n.kind}`];
  if (!tpl) return null;
  return posix.normalize(tpl.replace("{dir}", n.dir).replace("{kebab}", kebab(n.name)).replace("{name}", n.name));
}

/** Nodes a model compiles: every node whose kind has a path in the target. */
export function isCompilable(p: Project, n: AilNode): boolean {
  return modulePath(p, n) !== null;
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
