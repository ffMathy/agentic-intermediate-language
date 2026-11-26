// Screenshots of the proofs. For every node with a `look`, each test of its
// derived check is run once more with a preload that records the final
// screen; each screen is then rendered in Chromium (Playwright) with the
// project's own page styles, so a reviewer sees what each scenario ends on.
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import type { AilNode } from "./parse.ts";
import { AIL_HOME, kebab, SHOTS, type Project } from "./project.ts";
import { readLock, writeLock } from "./lock.ts";
import { checksDir, derivedCheckFile, junitResults } from "./verify.ts";
export { junitResults, type TestResult } from "./verify.ts";
import { e2eCheckPath, reportTests } from "./tests.ts";

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
// file (a spec file holds one node), with a shots.json index: in its folder's
// shots/ when the file is named like its folder (open-picker/open-picker.ail.md),
// else in shots/<file name>/ (sections/footer.ail.md → sections/shots/footer/).
// A flow's end-to-end screenshots are in that folder's e2e/. So a spec folder holds the spec and
// the proof of how it looks, and a pull request shows both together. They are
// part of what a build produces, like the generated code: reviewed in pull
// requests, shown on pages through the spec module, and judged against the
// look. A build retakes them when it builds the node; the lock records which
// build they were taken from, so a check can tell when they are out of date.
// There is no other place for them: `shots` is a reserved folder name in a
// spec, and `e2e` a reserved file name.

export { SHOTS };
export function nodeShotsDir(p: Project, n: AilNode): string {
  const folder = dirname(join(p.root, n.file));
  const name = basename(n.file).replace(/\.ail\.md$/, "");
  return name === basename(folder) ? join(folder, SHOTS) : join(folder, SHOTS, name);
}
/** Where a flow's end-to-end screenshots go, handed to its check as AIL_SHOTS_DIR. */
export const e2eShotsDir = (p: Project, n: AilNode) => join(nodeShotsDir(p, n), "e2e");
/** Where proof screenshots were kept before they moved beside the spec: moved by a build. */
export const legacyShotsDir = (p: Project) => join(checksDir(p), "shots");

/** Whether a file (relative to the project) is a committed proof screenshot or its index. */
export function isShotFile(p: Project, rel: string): boolean {
  const spec = relative(p.root, p.specRoot).split("\\").join("/");
  const f = rel.split("\\").join("/");
  const inSpec = spec ? (f.startsWith(spec + "/") ? f.slice(spec.length + 1) : null) : f;
  return inSpec !== null && !inSpec.endsWith(".ail.md") && new RegExp(`(^|/)${SHOTS}/`).test(inSpec);
}

/** Remove a folder's screenshots and index, keeping subfolders (a node's e2e/); empty folders up to the spec folder go too. */
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
  const lock = readLock(p);
  const entry = lock.nodes[n.name];
  if (entry) { entry.shots = entry.hash; writeLock(p, lock); }
  return shots;
}

/** Built nodes with a look whose committed screenshots are missing or from an older build. */
export function staleShots(p: Project): AilNode[] {
  const lock = readLock(p);
  return visualNodes(p).filter((n) => { const e = lock.nodes[n.name]; return e && e.shots !== e.hash; });
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
  const keep = new Set(visualNodes(p).map((n) => nodeShotsDir(p, n)));
  // A flow's end-to-end screenshots stay while it has an end-to-end check.
  for (const n of p.ordered) if (existsSync(e2eCheckPath(p, n))) keep.add(e2eShotsDir(p, n));
  return shotFolders(p).filter((d) => !keep.has(d));
}

/**
 * Move screenshots that are not where they belong (in checks/shots/, where
 * they used to be kept, or in an older layout beside the spec) to their
 * node's place, by the node each index names. Those of nodes that are gone
 * from checks/shots/ are dropped; screenshots already in their place are
 * newer and are kept. True when anything moved.
 */
export function relocateShots(p: Project): boolean {
  const old = legacyShotsDir(p);
  const moves: { from: string; to: string; legacy: boolean }[] = [];
  const target = (node: string, e2e: boolean) => {
    const n = p.nodes.get(node);
    return n ? (e2e ? e2eShotsDir(p, n) : nodeShotsDir(p, n)) : null;
  };
  const nodeOf = (dir: string) => (JSON.parse(readFileSync(join(dir, "shots.json"), "utf8")) as { node: string }).node;
  for (const dir of shotFolders(p)) {
    const to = target(nodeOf(dir), basename(dir) === "e2e");
    if (to && to !== dir) moves.push({ from: dir, to, legacy: false });
  }
  if (existsSync(old)) for (const f of new Bun.Glob("**/shots.json").scanSync({ cwd: old })) {
    const from = join(old, dirname(f));
    const to = target(nodeOf(from), f.split("/")[0] === "e2e");
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
