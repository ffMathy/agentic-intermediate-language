// Screenshots of the proofs. For every node with a `look`, each test of its
// derived check is run once more with a preload that records the final
// screen; each screen is then rendered in Chromium (Playwright) with the
// project's own page styles, so a reviewer sees what each scenario ends on.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import type { AilNode } from "./parse.ts";
import { AIL_HOME, kebab, type Project } from "./project.ts";
import { derivedCheckFile } from "./verify.ts";

export interface Shot { node: string; test: string; file: string }

/** Nodes whose proofs can be pictured: they have a look, and a derived check. */
export function visualNodes(p: Project, names?: string[]): AilNode[] {
  return p.ordered.filter((n) => (!names || names.includes(n.name)) && n.sections.some((s) => s.key === "look") && derivedCheckFile(p, n).file);
}

/** Test names of a JUnit report, in run order, without skipped or todo tests. */
export function junitTests(xml: string): string[] {
  const out: string[] = [];
  for (const m of xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    if (/<skipped\b/.test(m[3] ?? "")) continue;
    const name = /\bname="([^"]*)"/.exec(m[1]!)?.[1] ?? "";
    out.push(name.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
  }
  return out;
}

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

export function shotPage(styles: string, screen: { html: string; head: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8">${styles}\n${screen.head}</head><body><div id="ail-shot" style="padding:24px">${screen.html}</div></body></html>`;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "test";

/**
 * Screenshots of every visual node's proofs (or of `names` only), written to
 * `<outDir>/<node folder>/<node>/<nn>-<test>.png`.
 */
export async function takeShots(p: Project, outDir: string, names?: string[], log: (s: string) => void = () => {}): Promise<Shot[]> {
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
    const page = await browser.newPage({ viewport: { width: 1024, height: 640 }, deviceScaleFactor: 2 });
    for (const n of nodes) {
      const screens = captureScreens(p, derivedCheckFile(p, n).file!);
      log(`· ${n.name}: ${screens.length} screen(s)`);
      for (const [i, s] of screens.entries()) {
        const file = join(outDir, n.dir, kebab(n.name), `${String(i + 1).padStart(2, "0")}-${slug(s.test)}.png`);
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
  writeFileSync(join(outDir, "shots.json"), JSON.stringify(shots.map((s) => ({ ...s, file: relative(outDir, s.file) })), null, 2));
  return shots;
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
