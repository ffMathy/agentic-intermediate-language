// `ail diverge`: ambiguity as a compile error.
//
// Compile the same node N times per model (at high temperature where the
// vendor allows it), then compare the samples on observable behaviour, not on
// text: verification outcome, exported API surface, and the values of the
// node's `probes` (inputs whose output the spec does not pin down on purpose).
// Disagreement means the node is under-specified; the report says where.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { compileNode, type ParsedReply } from "./compile.ts";
import type { AilNode } from "./parse.ts";
import { kebab, modulePath, type Project } from "./project.ts";
import type { Provider } from "./providers/index.ts";
import { verifyNode } from "./verify.ts";

export interface Sample {
  model: string;
  index: number;
  stop: string | null;
  verified: boolean;
  failures: string[];
  fingerprint: { exports: string[]; probes: Record<string, string> } | null;
}
export interface DivergeReport {
  node: string;
  samples: Sample[];
  verdict: "converged" | "divergent";
  findings: string[];
}

function probeScript(p: Project, n: AilNode): string {
  const abs = (rel: string) => resolve(p.root, rel);
  const deps = n.uses.map((u) => p.nodes.get(u)).filter((d): d is AilNode => !!d && !!modulePath(p, d));
  const probes = n.probes.map((x) => x.expr);
  return [
    ...deps.map((d, i) => `import * as __d${i} from ${JSON.stringify(abs(modulePath(p, d)!))};`),
    `import * as __self from ${JSON.stringify(abs(modulePath(p, n)!))};`,
    `const __scope: Record<string, unknown> = { ${deps.map((_, i) => `...__d${i}, `).join("")}...__self };`,
    `const __eval = (src: string) => new Function(...Object.keys(__scope), "return (" + src + ");")(...Object.values(__scope));`,
    `const __show = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === "function" ? "[function]" : x === undefined ? "[undefined]" : x));`,
    `const out = { exports: Object.keys(__self).sort().map((k) => k + ":" + typeof (__self as any)[k]), probes: {} as Record<string, string> };`,
    `for (const src of ${JSON.stringify(probes)}) { try { out.probes[src] = __show(__eval(src)); } catch (e) { out.probes[src] = "throws " + (e as Error).message; } }`,
    `console.log(JSON.stringify(out));`,
  ].join("\n");
}

function fingerprint(p: Project, n: AilNode): Sample["fingerprint"] {
  const dir = join(p.root, ".ail", "diverge");
  mkdirSync(dir, { recursive: true });
  const f = join(dir, `${kebab(n.name)}.probe.ts`);
  writeFileSync(f, probeScript(p, n));
  const r = Bun.spawnSync(["bun", f], { cwd: p.root, stdout: "pipe", stderr: "pipe" });
  const line = r.stdout.toString().trim().split("\n").pop() ?? "";
  try { return JSON.parse(line); } catch { return { exports: [], probes: { "(load)": "failed: " + r.stderr.toString().trim().split("\n")[0] } }; }
}

/** Evaluate one candidate in place, then restore whatever was there. */
function evaluate(p: Project, n: AilNode, reply: ParsedReply): Omit<Sample, "model" | "index" | "stop"> {
  const path = modulePath(p, n)!;
  const abs = join(p.root, path);
  const backup = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  const body = reply.files[path];
  if (body === undefined) return { verified: false, failures: [`did not return ${path}`], fingerprint: null };
  try {
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, body);
    const v = verifyNode(p, n, { checkDrift: false });
    return {
      verified: v.ok,
      failures: v.checks.filter((c) => !c.ok && c.severity === "error").map((c) => `${c.kind}: ${c.detail.split("\n")[0]}`),
      fingerprint: fingerprint(p, n),
    };
  } finally {
    if (backup === null) rmSync(abs, { force: true }); else writeFileSync(abs, backup);
  }
}

export async function diverge(p: Project, n: AilNode, providers: Provider[], samplesPerModel: number, temperature?: number, log: (m: string) => void = () => {}): Promise<DivergeReport> {
  const samples: Sample[] = [];
  for (const provider of providers) {
    for (let i = 0; i < samplesPerModel; i++) {
      log(`${n.name}: sample ${i + 1}/${samplesPerModel} from ${provider.id}`);
      const { reply } = await compileNode(p, n, { provider, temperature }, i);
      if (reply.stop) { samples.push({ model: provider.id, index: i, stop: reply.stop, verified: false, failures: [], fingerprint: null }); continue; }
      samples.push({ model: provider.id, index: i, stop: null, ...evaluate(p, n, reply) });
    }
  }

  const findings: string[] = [];
  const label = (s: Sample) => `${s.model}#${s.index + 1}`;
  for (const s of samples.filter((x) => x.stop)) findings.push(`${label(s)} stopped: "${s.stop}" — answer this in the IL`);

  const ran = samples.filter((s) => !s.stop);
  const passed = ran.filter((s) => s.verified);
  if (passed.length && passed.length < ran.length)
    for (const s of ran.filter((x) => !x.verified)) findings.push(`${label(s)} failed verification (${s.failures.join("; ")}) while ${passed.length}/${ran.length} passed — the checks or the spec may be too loose to guide every model`);
  if (ran.length && !passed.length) findings.push(`no sample passed verification — the node may be infeasible or contradictory`);

  const surfaces = new Map<string, Sample[]>();
  for (const s of passed) { const k = s.fingerprint?.exports.join(",") ?? ""; surfaces.set(k, [...(surfaces.get(k) ?? []), s]); }
  if (surfaces.size > 1)
    findings.push(`exported API differs between samples:\n${[...surfaces].map(([k, ss]) => `    [${k}] ← ${ss.map(label).join(", ")}`).join("\n")}\n  → name the exports in \`what\``);

  for (const probe of n.probes.map((x) => x.expr)) {
    const values = new Map<string, Sample[]>();
    for (const s of passed) { const v = s.fingerprint?.probes[probe] ?? "(missing)"; values.set(v, [...(values.get(v) ?? []), s]); }
    if (values.size > 1)
      findings.push(`probe \`${probe}\` disagrees:\n${[...values].map(([v, ss]) => `    ${v}  ← ${ss.length}/${passed.length} (${ss.map(label).join(", ")})`).join("\n")}\n  → pin this behaviour with an example, or list it in \`free\` if it truly doesn't matter`);
  }
  return { node: n.name, samples, verdict: findings.length ? "divergent" : "converged", findings };
}

export function formatDiverge(reports: DivergeReport[]): string {
  return reports.map((r) => {
    const passed = r.samples.filter((s) => s.verified).length;
    const head = `${r.verdict === "converged" ? "✓" : "✗"} ${r.node}: ${r.verdict} (${passed}/${r.samples.length} samples verified, ${new Set(r.samples.map((s) => s.model)).size} model(s))`;
    return [head, ...r.findings.map((f) => "  • " + f)].join("\n");
  }).join("\n\n");
}
