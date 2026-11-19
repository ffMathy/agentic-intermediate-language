// The look check: a model compares the final screen of each of a node's tests
// with the node's `look` and `copy`. Tests prove behaviour; this catches what
// they can't, such as a wrong color, order or spacing. Its verdict is
// recorded in the lock, so the check (which never calls a model) can say
// which screens nobody has compared yet.
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { readLock, writeLock } from "./lock.ts";
import type { AilNode } from "./parse.ts";
import { ancestors, type Project } from "./project.ts";
import type { Provider } from "./providers/index.ts";
import { takeShots, visualNodes, type Shot } from "./shots.ts";
import { loadPrompt } from "./verify.ts";

export interface LookResult { node: string; ok: boolean; problems: string[]; shots: Shot[]; skipped?: string }

/** At most this many screens go to the model in one call. */
export const MAX_SCREENS = 12;

export const hasLook = (n: AilNode) => n.sections.some((s) => s.key === "look");

/** The text the model judges the screens against: the node, its why, and the token values. */
export function lookTask(p: Project, n: AilNode, shots: Shot[]): string {
  const chain = ancestors(p, n.name).map((a) => `- ${a.name}: ${a.why?.text ?? ""}`).join("\n");
  const tokens = Object.entries(p.tokens).map(([k, v]) => (v ? `${k}=${v}` : k)).join("  ");
  return [
    `## Node ${n.name}`,
    ...(chain ? ["Why it exists, from the top:", chain, ""] : []),
    "```ail", ...n.raw, "```",
    ...(tokens ? ["", "## Design tokens", tokens, `In the page they are CSS variables: token a.b.c → var(--a-b-c).`] : []),
    "",
    "## Screenshots",
    `${shots.length} screenshot(s) are attached above, in this order: ${shots.map((s) => `"${s.test}"`).join(", ")}.`,
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
 * Screenshot a node's tests and ask the model whether they match its look.
 * Screens are kept in .ail/look/ so a person can see what was judged.
 */
export async function lookCheck(p: Project, n: AilNode, provider: Provider, log: (s: string) => void = () => {}): Promise<LookResult> {
  if (!visualNodes(p, [n.name]).length) return { node: n.name, ok: true, problems: [], shots: [], skipped: "no look, or no derived check to picture" };
  const dir = join(p.root, ".ail", "look");
  rmSync(join(dir, n.dir, n.name), { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let shots: Shot[];
  try {
    shots = await takeShots(p, dir, [n.name]);
  } catch (e) {
    return { node: n.name, ok: true, problems: [], shots: [], skipped: (e as Error).message };
  }
  if (!shots.length) return { node: n.name, ok: true, problems: [], shots, skipped: "its tests left nothing on screen" };
  const judged = shots.slice(0, MAX_SCREENS);
  if (judged.length < shots.length) log(`${n.name}: judging the first ${MAX_SCREENS} of ${shots.length} screens`);
  const reply = await provider.complete({
    system: loadPrompt("judge-look"),
    prompt: lookTask(p, n, judged),
    images: judged.map((s, i) => ({ label: `Screenshot ${i + 1}: "${s.test}"`, mediaType: "image/png", data: readFileSync(s.file).toString("base64") })),
    meta: { node: n.name, purpose: "look" },
  });
  return { node: n.name, ...parseVerdict(reply), shots };
}

/** Record that a node's screens matched its look, for the build in the lock. */
export function recordLook(p: Project, node: string) {
  const lock = readLock(p);
  const entry = lock.nodes[node];
  if (!entry) return;
  entry.look = entry.hash;
  writeLock(p, lock);
}

/** Built nodes with a look whose screens were not compared for their current build. */
export function unjudged(p: Project): string[] {
  const lock = readLock(p);
  return visualNodes(p).filter((n) => { const e = lock.nodes[n.name]; return e && e.look !== e.hash; }).map((n) => n.name);
}

export const formatLook = (r: LookResult) =>
  r.skipped ? `- ${r.node}: not compared (${r.skipped})`
  : r.ok ? `✓ ${r.node}: ${r.shots.length} screen(s) match its look`
  : `✗ ${r.node}: its screens don't match its look\n${r.problems.map((x) => `    - ${x}`).join("\n")}`;
