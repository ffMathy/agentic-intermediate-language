// Screenshots of the proofs. For every node with a `look`, its derived check
// pictures each scenario's final screen. In TypeScript, each test is run once
// more with a preload that records the final screen, which is then rendered in
// Chromium (Playwright) with the project's own page styles. A check in another
// language saves the screens itself: it is run with AIL_SHOTS_DIR set, and
// saves each scenario's final screen there as <scenario slug>.png. End-to-end
// checks take no screenshots: they prove the app behaves, the derived checks
// show what it looks like.
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import type { AilNode } from "./parse.ts";
import { AIL_HOME, kebab, SHOTS, type Project } from "./project.ts";
import { readLock, writeLock } from "./lock.ts";
import { checksDir, derivedCheckFile, foreignChecks, junitResults, runForeignCheck } from "./verify.ts";
export { junitResults, type TestResult } from "./verify.ts";
import { reportTests } from "./tests.ts";
import { isCompilable } from "./project.ts";
import { adoptedFresh } from "./plan.ts";

export interface Shot { node: string; test: string; file: string }

/** The file name a check saves a scenario's screenshot under: the test's name as a slug, plus ".png". */
export const shotFileName = (test: string) => `${slugOf(test)}.png`;

/** Pair the screenshots a check saved with its tests (in run order), and write the folder's index. */
export function collectShots(dir: string, node: string, tests: string[]): { shots: Shot[]; missing: string[] } {
  const shots: Shot[] = [], missing: string[] = [];
  for (const t of tests) {
    const f = join(dir, shotFileName(t));
    if (existsSync(f)) shots.push({ node, test: t, file: f }); else missing.push(t);
  }
  if (shots.length) writeFileSync(join(dir, "shots.json"), JSON.stringify({ node, shots: shots.map((s) => ({ test: s.test, file: relative(dir, s.file) })) }, null, 2) + "\n");
  return { shots, missing };
}

/**
 * A node whose code is written by hand, not by ail: adopted (built by the existing app), `@existing`, or of a
 * kind the target has no path for. With a look, its derived check tests that code, and pictures it.
 */
export function handBuilt(p: Project, n: AilNode): boolean {
  return !isCompilable(p, n) || adoptedFresh(p, n, readLock(p).nodes[n.name]);
}

/** What a node's screenshots are keyed to: its build (compile hash), or, built by hand, its derived check's pin. */
export function shotKey(p: Project, n: AilNode): string | null {
  return handBuilt(p, n) ? derivedCheckFile(p, n).pinned : readLock(p).nodes[n.name]?.hash ?? null;
}

/**
 * What a node's look verdict is keyed to. A build of ail's: its compile hash. Built by hand: the screens themselves,
 * since the app's own code can change them without changing the spec or the check; a model compares them again
 * exactly when they change.
 */
export function lookKey(p: Project, n: AilNode): string | null {
  return handBuilt(p, n) ? screensHash(p, n) : shotKey(p, n);
}

/** A hash of a node's committed screenshots and their index, or null when it has none. */
export function screensHash(p: Project, n: AilNode): string | null {
  const dir = nodeShotsDir(p, n);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => !statSync(join(dir, f)).isDirectory()).sort();
  if (!files.length) return null;
  const h = new Bun.CryptoHasher("sha256");
  for (const f of files) h.update(f).update(readFileSync(join(dir, f)));
  return h.digest("hex");
}

const keyOf = (p: Project, n: AilNode, what: "shots" | "look") => (what === "look" ? lookKey(p, n) : shotKey(p, n));

/** The key the committed screenshots (`shots`) or the look verdict (`look`) were recorded for. */
export function recordedFor(p: Project, n: AilNode, what: "shots" | "look"): string | undefined {
  const lock = readLock(p);
  return handBuilt(p, n) ? lock.hand?.[n.name]?.[what] : lock.nodes[n.name]?.[what];
}

/** Record that a node's screenshots, or its look verdict, are those of its current key. */
export function recordFor(p: Project, n: AilNode, what: "shots" | "look"): void {
  const key = keyOf(p, n, what);
  if (!key) return;
  const lock = readLock(p);
  if (handBuilt(p, n)) (((lock.hand ??= {})[n.name] ??= {})[what] = key);
  else if (lock.nodes[n.name]) lock.nodes[n.name]![what] = key;
  else return;
  writeLock(p, lock);
}

/** Nodes whose proofs can be pictured: they have a look, and a derived check. */
export function visualNodes(p: Project, names?: string[]): AilNode[] {
  return p.ordered.filter((n) => (!names || names.includes(n.name)) && n.sections.some((s) => s.key === "look") && derivedCheckFile(p, n).file);
}

/** Test names of a JUnit (or TRX) report, in run order, without skipped or todo tests. */
export const junitTests = (xml: string): string[] => reportTests(xml).map((t) => t.name);

/** The final screen of each test in one check file, paired with its test name. */
export function captureScreens(p: Project, checkFile: string): { test: string; html: string; head: string }[] {
  const tmp = mkdtempSync(join(tmpdir(), "ail-shots-"));
  try {
    const out = join(tmp, "screens.json"), report = join(tmp, "report.xml");
    Bun.spawnSync(["bun", "test", "--preload", join(AIL_HOME, "src/shots-preload.ts"), "--reporter=junit", `--reporter-outfile=${report}`, "./" + relative(p.root, checkFile)], {
      cwd: p.root, env: { ...process.env, AIL_SHOTS_OUT: out, NO_COLOR: "1" }, stdout: "pipe", stderr: "pipe",
    });
    if (!existsSync(out) || !existsSync(report)) return [];
    const screens = JSON.parse(readFileSync(out, "utf8")) as { html: string; head: string }[];
    const names = junitTests(readFileSync(report, "utf8"));
    return screens.slice(0, names.length).map((s, i) => ({ test: names[i]!, ...s })).filter((s) => s.html);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** The page's own styles: the stylesheets and style blocks of the project's index.html, local files inlined. */
export function pageStyles(p: Project): string {
  const index = join(p.root, "index.html");
  const parts: string[] = [];
  const css = p.target?.settings["tokens-css"];
  if (!existsSync(index)) {
    if (css && existsSync(join(p.root, css))) parts.push(`<style>${readFileSync(join(p.root, css), "utf8")}</style>`);
    return parts.join("\n");
  }
  const head = /<head>([\s\S]*?)<\/head>/i.exec(readFileSync(index, "utf8"))?.[1] ?? "";
  for (const m of head.matchAll(/<link\b[^>]*>|<style\b[^>]*>[\s\S]*?<\/style>/gi)) {
    const tag = m[0];
    if (tag.startsWith("<style") || tag.startsWith("<STYLE")) { parts.push(tag); continue; }
    if (!/rel=["']?stylesheet/i.test(tag)) continue;
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href) continue;
    if (/^(https?:)?\/\//.test(href)) parts.push(tag);
    else if (existsSync(resolve(p.root, href))) parts.push(`<style>${readFileSync(resolve(p.root, href), "utf8")}</style>`);
  }
  return parts.join("\n");
}

const MEDIA: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };

/** In tests, an imported image is a path on disk, which a page cannot load: inline it. */
export function inlineImages(html: string): string {
  return html.replace(/(src=")(\/[^"]+\.(png|jpe?g|gif|webp|svg))"/gi, (m, pre: string, path: string, ext: string) =>
    existsSync(path) ? `${pre}data:${MEDIA[ext.toLowerCase()]};base64,${readFileSync(path).toString("base64")}"` : m);
}

export function shotPage(styles: string, screen: { html: string; head: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8">${styles}\n${screen.head}</head><body><div id="ail-shot" style="padding:24px">${inlineImages(screen.html)}</div></body></html>`;
}

/**
 * Run a node's derived check in the target's own language with AIL_SHOTS_DIR set, and collect the screens it
 * saved there (<scenario slug>.png), numbered in the order of the node's scenarios, into `dir`.
 */
export function savedShots(p: Project, n: AilNode, dir: string): Shot[] {
  const file = derivedCheckFile(p, n).file;
  if (!file) return [];
  const tmp = mkdtempSync(join(tmpdir(), "ail-saved-"));
  try {
    const r = runForeignCheck(p, n, [file], { AIL_SHOTS_DIR: tmp });
    if (!r.ok) throw new Error(`${n.name}'s check failed, so its screens were not taken:\n${r.output.split("\n").slice(-15).join("\n")}`);
    const shots: Shot[] = [];
    n.scenarios.forEach((sc, i) => {
      const from = join(tmp, shotFileName(sc.title));
      if (!existsSync(from)) return;
      const to = join(dir, `${String(i + 1).padStart(2, "0")}-${slug(sc.title)}.png`);
      mkdirSync(dir, { recursive: true });
      copyFileSync(from, to);
      shots.push({ node: n.name, test: sc.title, file: to });
    });
    return shots;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** A test name as a file name: lower case, each run of other characters one "-", at most 60 characters. */
export const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "test";
const slug = slugOf;

/**
 * Screenshots of every visual node's proofs (or of `names` only), written to
 * `<outDir>/<node folder>/<node>/<nn>-<test>.png`, or to `opts.dirOf(node)`.
 */
export async function takeShots(p: Project, outDir: string, names?: string[], log: (s: string) => void = () => {}, opts: { scale?: number; manifest?: boolean; dirOf?: (n: AilNode) => string } = {}): Promise<Shot[]> {
  const nodes = visualNodes(p, names);
  if (!nodes.length) return [];
  if (foreignChecks(p)) {
    const shots = nodes.flatMap((n) => {
      const taken = savedShots(p, n, opts.dirOf?.(n) ?? join(outDir, n.dir, kebab(n.name)));
      log(`· ${n.name}: ${taken.length} screen(s)`);
      return taken;
    });
    if (opts.manifest !== false) writeFileSync(join(outDir, "shots.json"), JSON.stringify(shots.map((s) => ({ ...s, file: relative(outDir, s.file) })), null, 2));
    return shots;
  }
  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("screenshots need Playwright: run `bun add -g playwright` and `bunx playwright install chromium`");
  }
  const browser = await chromium.launch(process.env.AIL_CHROMIUM ? { executablePath: process.env.AIL_CHROMIUM } : {});
  const styles = pageStyles(p);
  const shots: Shot[] = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 640 }, deviceScaleFactor: opts.scale ?? 2 });
    for (const n of nodes) {
      const screens = captureScreens(p, derivedCheckFile(p, n).file!);
      log(`· ${n.name}: ${screens.length} screen(s)`);
      for (const [i, s] of screens.entries()) {
        const file = join(opts.dirOf?.(n) ?? join(outDir, n.dir, kebab(n.name)), `${String(i + 1).padStart(2, "0")}-${slug(s.test)}.png`);
        mkdirSync(dirname(file), { recursive: true });
        await page.setContent(shotPage(styles, s), { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
        await page.evaluate(() => document.fonts.ready).catch(() => {});
        await page.locator("#ail-shot").screenshot({ path: file, animations: "disabled" });
        shots.push({ node: n.name, test: s.test, file });
      }
    }
  } finally {
    await browser.close();
  }
  if (opts.manifest !== false) writeFileSync(join(outDir, "shots.json"), JSON.stringify(shots.map((s) => ({ ...s, file: relative(outDir, s.file) })), null, 2));
  return shots;
}

// --- the committed proof screenshots ------------------------------------------
//
// Every node with a look keeps the screenshots of its proofs beside its spec
// file, in its folder's shots/, with a shots.json index: a spec file holds one
// node, and a folder one spec file, so there is always room for them.
// So a spec folder holds the spec and the proof of how it looks, and a pull request shows both together. They are
// part of what a build produces, like the generated code: reviewed in pull
// requests, shown on pages through the spec module, and judged against the
// look. A build retakes them when it builds the node; the lock records which
// build they were taken from, so a check can tell when they are out of date.
// There is no other place for them: `shots` is a reserved folder name in a spec.

export { SHOTS };
export const nodeShotsDir = (p: Project, n: AilNode) => join(dirname(join(p.root, n.file)), SHOTS);
/** Where proof screenshots were kept before they moved beside the spec: moved by a build. */
export const legacyShotsDir = (p: Project) => join(checksDir(p), "shots");

/** Whether a file (relative to the project) is a committed proof screenshot or its index. */
export function isShotFile(p: Project, rel: string): boolean {
  const spec = relative(p.root, p.specRoot).split("\\").join("/");
  const f = rel.split("\\").join("/");
  const inSpec = spec ? (f.startsWith(spec + "/") ? f.slice(spec.length + 1) : null) : f;
  return inSpec !== null && !inSpec.endsWith(".ail.md") && new RegExp(`(^|/)${SHOTS}/`).test(inSpec);
}

/** Remove a folder's screenshots and index, keeping subfolders; empty folders up to the spec folder go too. */
export function clearShots(dir: string): void {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) if (!statSync(join(dir, f)).isDirectory()) rmSync(join(dir, f), { force: true });
  for (let d = dir; existsSync(d) && readdirSync(d).length === 0; d = dirname(d)) {
    rmdirSync(d);
    if (basename(d) === SHOTS) break;
  }
}

/** Retake a node's committed proof screenshots, and record the build they belong to. */
export async function refreshNodeShots(p: Project, n: AilNode, log: (s: string) => void = () => {}): Promise<Shot[]> {
  const dir = nodeShotsDir(p, n);
  // Taken into a scratch folder first: the old screenshots stay in place while the tests run, since a page
  // can import them (through the spec module), and a test that imports a missing image never renders.
  const tmp = mkdtempSync(join(tmpdir(), "ail-retake-"));
  let shots: Shot[];
  try {
    const taken = await takeShots(p, tmp, [n.name], log, { scale: 1, manifest: false, dirOf: () => tmp });
    clearShots(dir);
    if (taken.length) mkdirSync(dir, { recursive: true });
    shots = taken.map((s) => {
      const file = join(dir, basename(s.file));
      copyFileSync(s.file, file);
      return { ...s, file };
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  if (shots.length) writeFileSync(join(dir, "shots.json"), JSON.stringify({ node: n.name, shots: shots.map((s) => ({ test: s.test, file: relative(dir, s.file) })) }, null, 2) + "\n");
  recordFor(p, n, "shots");
  return shots;
}

/** Nodes with a look whose committed screenshots are missing, or from an older build (or, built by hand, an older check). */
export function staleShots(p: Project): AilNode[] {
  return visualNodes(p).filter((n) => { const key = shotKey(p, n); return !!key && recordedFor(p, n, "shots") !== key; });
}

/** Every committed screenshot folder: the folders under the spec that hold a shots.json, in path order. */
export function shotFolders(p: Project): string[] {
  if (!existsSync(p.specRoot)) return [];
  const legacy = legacyShotsDir(p);
  return [...new Bun.Glob(`**/${SHOTS}/**/shots.json`).scanSync({ cwd: p.specRoot })]
    .filter((f) => !/(^|\/)(node_modules|\.[^/]+)\//.test(f))
    .map((f) => join(p.specRoot, dirname(f)))
    .filter((d) => d !== legacy && !d.startsWith(legacy + sep)).sort();
}

/** Screenshot folders of nodes that no longer exist, or no longer have a look: removed by a build. */
export function orphanShots(p: Project): string[] {
  // End-to-end checks take no screenshots: those they took once (in shots/e2e/) go too.
  const keep = new Set(visualNodes(p).map((n) => nodeShotsDir(p, n)));
  return shotFolders(p).filter((d) => !keep.has(d));
}

/**
 * Move screenshots that are not where they belong (in checks/shots/, where
 * they used to be kept, or in an older layout beside the spec) to their
 * node's place, by the node each index names. Those of nodes that are gone
 * from checks/shots/, and end-to-end ones (in an e2e/ folder), are dropped;
 * screenshots already in their place are newer and are kept. True when
 * anything moved.
 */
export function relocateShots(p: Project): boolean {
  const old = legacyShotsDir(p);
  const moves: { from: string; to: string; legacy: boolean }[] = [];
  const target = (node: string, e2e: boolean) => {
    const n = p.nodes.get(node);
    return n && !e2e ? nodeShotsDir(p, n) : null;
  };
  const nodeOf = (dir: string) => (JSON.parse(readFileSync(join(dir, "shots.json"), "utf8")) as { node: string }).node;
  for (const dir of shotFolders(p)) {
    const to = target(nodeOf(dir), basename(dir) === "e2e" || dir.includes(`${sep}e2e${sep}`));
    if (to && to !== dir) moves.push({ from: dir, to, legacy: false });
  }
  if (existsSync(old)) for (const f of new Bun.Glob("**/shots.json").scanSync({ cwd: old })) {
    const from = join(old, dirname(f));
    const to = target(nodeOf(from), f.split("/").includes("e2e"));
    if (to) moves.push({ from, to, legacy: true });
  }
  if (!moves.length) {
    if (!existsSync(old)) return false;
    rmSync(old, { recursive: true, force: true });
    return true;
  }
  // Staged first: one folder's place can be another's old place (shots/<node>/ → shots/).
  const stage = mkdtempSync(join(tmpdir(), "ail-relocate-"));
  try {
    const staged = moves.map((m, i) => {
      const at = join(stage, String(i));
      mkdirSync(at);
      for (const file of readdirSync(m.from)) if (!statSync(join(m.from, file)).isDirectory()) copyFileSync(join(m.from, file), join(at, file));
      return { ...m, at };
    });
    for (const m of staged) clearShots(m.from);
    rmSync(old, { recursive: true, force: true });
    // Those beside the spec first: they are newer than any left in checks/shots/.
    for (const m of [...staged.filter((x) => !x.legacy), ...staged.filter((x) => x.legacy)]) {
      if (existsSync(join(m.to, "shots.json"))) continue;
      mkdirSync(m.to, { recursive: true });
      for (const file of readdirSync(m.at)) copyFileSync(join(m.at, file), join(m.to, file));
    }
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
  return true;
}

/** A folder's committed screenshots: the index a build wrote, with absolute files. */
export function readShotsIndex(dir: string): { node: string; shots: { test: string; file: string }[] } | null {
  const f = join(dir, "shots.json");
  if (!existsSync(f)) return null;
  const idx = JSON.parse(readFileSync(f, "utf8")) as { node: string; shots: { test: string; file: string }[] };
  return { node: idx.node, shots: idx.shots.map((s) => ({ test: s.test, file: join(dir, s.file) })) };
}

/** Nodes a change can make look different: the changed ones, and the nodes that use them directly (the change in context). */
export function changedScreens(p: Project, changed: string[]): string[] {
  const out = new Set(changed);
  for (const c of changed) for (const u of p.ordered) if (u.uses.includes(c)) out.add(u.name);
  return p.ordered.filter((n) => out.has(n.name)).map((n) => n.name);
}

/** Markdown for screenshots, one collapsible group per node. Image links are `<base>/<path in outDir>`. */
export function renderShots(shots: Shot[], outDir: string, base = outDir): string {
  if (!shots.length) return "";
  const out = ["\n## Screens", "", "_The final screen of each scenario's check, rendered in Chromium._"];
  for (const node of [...new Set(shots.map((s) => s.node))]) {
    const mine = shots.filter((s) => s.node === node);
    out.push("", `<details><summary><b>${node}</b> — ${mine.length} screen(s)</summary>`, "");
    for (const s of mine) {
      const url = `${base.replace(/\/$/, "")}/${relative(outDir, s.file).split("\\").join("/")}`;
      out.push(`**${s.test.replace(/[<>]/g, "")}**`, "", `<img src="${encodeURI(url)}" width="480" alt="${s.test.replace(/"/g, "&quot;")}">`, "");
    }
    out.push("</details>");
  }
  return out.join("\n") + "\n";
}
