// The look check: a model compares the final screen of each of a node's tests
// with the node's `look` and `copy`. Tests prove behaviour; this catches what
// they can't, such as a wrong color, order or spacing. Its verdict is
// recorded in the lock, so the check (which never calls a model) can say
// which screens nobody has compared yet.
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { readLock, writeLock } from "./lock.ts";
import { specText, type AilNode } from "./parse.ts";
import { ancestors, type Project } from "./project.ts";
import type { Provider } from "./providers/index.ts";
import { handBuilt, recordedFor, recordFor, refreshNodeShots, shotKey, visualNodes, type Shot } from "./shots.ts";
import { loadPrompt } from "./verify.ts";

export interface LookResult { node: string; ok: boolean; problems: string[]; shots: Shot[]; skipped?: string }

/** At most this many screens go to the model in one call. */
export const MAX_SCREENS = 12;

export const hasLook = (n: AilNode) => n.sections.some((s) => s.key === "look");

/** The text the model judges the screens against: the node, its why, and the token values. */
export function lookTask(p: Project, n: AilNode, shots: Shot[], wholeApp = false): string {
  const chain = ancestors(p, n.name).map((a) => `- ${a.name}: ${a.why?.text ?? ""}`).join("\n");
  const tokens = Object.entries(p.tokens).map(([k, v]) => (v ? `${k}=${v}` : k)).join("  ");
  return [
    `## Node ${n.name}`,
    ...(chain ? ["Why it exists, from the top:", chain, ""] : []),
    "```ail", specText(n), "```",
    ...(tokens ? ["", "## Design tokens", tokens, `In the page they are CSS variables: token a.b.c → var(--a-b-c).`] : []),
    "",
    "## Screenshots",
    `${shots.length} screenshot(s) are attached above, in this order: ${shots.map((s) => `"${s.test}"`).join(", ")}.`,
    ...(wholeApp ? ["They show the app's own windows, rendered by its derived check on whatever platform the app runs (a browser, a simulator, a desktop). This node may be only part of each screen: judge that part, and ignore everything around it that belongs to its parents or to other nodes (navigation, frames, system bars)."] : []),
    "Do they match the spec?",
  ].join("\n");
}

/** Parse "MATCHES" or "MISMATCH" followed by "- " lines. Anything else counts as a mismatch, quoted. */
export function parseVerdict(reply: string): { ok: boolean; problems: string[] } {
  // The verdict is the last line that is exactly MATCHES or MISMATCH; a model
  // may think aloud before it.
  const lines = reply.trim().split("\n");
  const at = lines.map((l) => l.trim()).findLastIndex((l) => l === "MATCHES" || l === "MISMATCH");
  if (at >= 0 && lines[at]!.trim() === "MATCHES") return { ok: true, problems: [] };
  const problems = at >= 0 ? lines.slice(at + 1).filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, "").trim()) : [];
  if (at >= 0 && problems.length) return { ok: false, problems };
  return { ok: false, problems: [`the judge's reply was not understood: ${reply.trim().slice(0, 300)}`] };
}

/**
 * Retake a node's proof screenshots (the committed ones, beside its spec in shots/)
 * and ask the model whether they match its look.
 */
export async function lookCheck(p: Project, n: AilNode, provider: Provider, log: (s: string) => void = () => {}): Promise<LookResult> {
  if (!visualNodes(p, [n.name]).length) return { node: n.name, ok: true, problems: [], shots: [], skipped: "no look, or no derived check to picture" };
  let shots: Shot[];
  try {
    shots = await refreshNodeShots(p, n);
  } catch (e) {
    return { node: n.name, ok: true, problems: [], shots: [], skipped: (e as Error).message };
  }
  if (!shots.length) return { node: n.name, ok: true, problems: [], shots, skipped: "its tests left nothing on screen" };
  return judgeShots(p, n, shots, provider, log, handBuilt(p, n));
}

/** Ask the model whether screenshots (from any platform) match a node's look. */
export async function judgeShots(p: Project, n: AilNode, shots: Shot[], provider: Provider, log: (s: string) => void = () => {}, wholeApp = false): Promise<LookResult> {
  const judged = shots.slice(0, MAX_SCREENS);
  if (judged.length < shots.length) log(`${n.name}: judging the first ${MAX_SCREENS} of ${shots.length} screens`);
  const reply = await provider.complete({
    system: loadPrompt("judge-look"),
    prompt: lookTask(p, n, judged, wholeApp),
    images: judged.map((s, i) => ({ label: `Screenshot ${i + 1}: "${s.test}"`, mediaType: "image/png", data: readFileSync(s.file).toString("base64") })),
    meta: { node: n.name, purpose: "look" },
  });
  return { node: n.name, ...parseVerdict(reply), shots };
}

/** Record that a node's screens matched its look, for its build (or, built by hand, its derived check) in the lock. */
export function recordLook(p: Project, node: string) {
  const n = p.nodes.get(node);
  if (n) recordFor(p, n, "look");
}

/** Nodes with a look whose screens were not compared for their current build (or, built by hand, derived check). */
export function unjudged(p: Project): string[] {
  return visualNodes(p).filter((n) => { const key = shotKey(p, n); return !!key && recordedFor(p, n, "look") !== key; }).map((n) => n.name);
}

export const formatLook = (r: LookResult) =>
  r.skipped ? `- ${r.node}: not compared (${r.skipped})`
  : r.ok ? `✓ ${r.node}: ${r.shots.length} screen(s) match its look`
  : `✗ ${r.node}: its screens don't match its look\n${r.problems.map((x) => `    - ${x}`).join("\n")}`;
