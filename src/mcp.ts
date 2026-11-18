// Minimal MCP server (JSON-RPC 2.0 over newline-delimited stdio) exposing the
// ail toolchain to any MCP-capable agent. No SDK dependency on purpose: the
// surface is small and this keeps the server identical across runtimes.
import { submit, writeGlue } from "./compile.ts";
import { buildContext } from "./context.ts";
import { renderLens, renderReview, LENSES, type Lens } from "./lens.ts";
import { formatDiagnostics, lint } from "./lint.ts";
import { formatPlan, plan } from "./plan.ts";
import { ancestors, loadProject, modulePath, type Project } from "./project.ts";
import { formatVerify, verifyProject } from "./verify.ts";

type Json = Record<string, unknown>;
interface Tool { name: string; description: string; inputSchema: Json; run: (p: Project, args: Json) => { text: string; isError?: boolean } }

const str = { type: "string" };
const obj = (properties: Json, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });

function needNode(p: Project, name: unknown) {
  const n = typeof name === "string" ? p.nodes.get(name) : undefined;
  if (!n) throw new Error(`unknown node "${String(name)}". Known: ${[...p.nodes.keys()].join(", ")}`);
  return n;
}

export const TOOLS: Tool[] = [
  {
    name: "ail_tree",
    description: "Outline of the IL tree: every node with kind, level and compile status. Start here to decide where to drill down.",
    inputSchema: obj({}),
    run: (p) => {
      const status = new Map(plan(p).map((e) => [e.node, e.status]));
      const lines = p.ordered.map((n) => `${"  ".repeat(ancestors(p, n.name).length)}${n.name} : ${n.kind} · ${n.level}${status.has(n.name) ? ` [${status.get(n.name)}]` : ""}`);
      return { text: lines.join("\n") };
    },
  },
  {
    name: "ail_node",
    description: "The full IL source of one node.",
    inputSchema: obj({ node: str }, ["node"]),
    run: (p, a) => { const n = needNode(p, a.node); return { text: `${n.file}:${n.line}\n${n.raw.join("\n")}` }; },
  },
  { name: "ail_lint", description: "Lint the IL: structure, why-traceability, refinement links, per-level vocabulary, catalog references.", inputSchema: obj({}),
    run: (p) => { const d = lint(p); return { text: formatDiagnostics(d), isError: d.some((x) => x.severity === "error") }; } },
  { name: "ail_plan", description: "Which compilable nodes are fresh, stale, missing or drifted.", inputSchema: obj({}), run: (p) => ({ text: formatPlan(plan(p)) }) },
  {
    name: "ail_context",
    description: "The encapsulated compile context for one node: profile, catalog, glossary, why chain, the node, its dependencies' contracts and golden examples. Implement the node from this context ONLY, then call ail_submit.",
    inputSchema: obj({ node: str }, ["node"]),
    run: (p, a) => ({ text: buildContext(p, needNode(p, a.node)) }),
  },
  {
    name: "ail_submit",
    description: "Submit the complete source of a node's module. It is written, verified against the node's checks, and recorded in ail.lock.json — or rolled back with the failures returned. This is the only way to write generated code.",
    inputSchema: obj({ node: str, content: str }, ["node", "content"]),
    run: (p, a) => {
      const n = needNode(p, a.node);
      const path = modulePath(p, n);
      if (!path) throw new Error(`${n.name} has no output path`);
      const r = submit(p, n, { [path]: String(a.content) }, "mcp");
      const detail = r.verify ? formatVerify({ results: [r.verify], typecheck: null, ok: r.ok }) : "";
      return { text: r.ok ? `accepted: ${path}\n${detail}` : `rejected: ${r.error}\n${detail}`, isError: !r.ok };
    },
  },
  {
    name: "ail_verify",
    description: "Run every check the IL implies (examples, derived checks, imports, drift, typecheck) for some or all nodes.",
    inputSchema: obj({ nodes: { type: "array", items: str } }),
    run: (p, a) => { const r = verifyProject(p, (a.nodes as string[]) ?? []); return { text: formatVerify(r), isError: !r.ok }; },
  },
  {
    name: "ail_lens",
    description: `Render the IL for an audience: ${LENSES.join(", ")}. Use 'specialist' with a tag (e.g. "ai") to see one concern with its why chain.`,
    inputSchema: obj({ lens: { type: "string", enum: [...LENSES] }, tag: str }, ["lens"]),
    run: (p, a) => ({ text: renderLens(p, a.lens as Lens, { tag: a.tag as string | undefined }) }),
  },
  {
    name: "ail_review",
    description: "Semantic IL diff since a git ref, grouped by level so each change goes to the right reviewers.",
    inputSchema: obj({ base: str }),
    run: (p, a) => ({ text: renderReview(p, (a.base as string) ?? "HEAD") }),
  },
  { name: "ail_glue", description: "Regenerate deterministic glue (design tokens CSS, entry point, catalog components).", inputSchema: obj({}),
    run: (p) => { const w = writeGlue(p); return { text: w.length ? `wrote ${w.join(", ")}` : "glue up to date" }; } },
];

export function handle(msg: Json, root?: string): Json | null {
  const id = msg.id as number | string | undefined;
  const method = msg.method as string;
  const reply = (result: Json) => ({ jsonrpc: "2.0", id, result });
  if (id === undefined) return null; // notification
  switch (method) {
    case "initialize":
      return reply({
        protocolVersion: (msg.params as Json)?.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "ail", version: "0.1.0" },
        instructions: "Tools for the Agentic Intermediate Language. The *.ail.md files are the source of truth; generated code is written only through ail_submit.",
      });
    case "ping": return reply({});
    case "tools/list": return reply({ tools: TOOLS.map(({ run: _r, ...t }) => t) });
    case "tools/call": {
      const params = msg.params as { name: string; arguments?: Json };
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return { jsonrpc: "2.0", id, error: { code: -32602, message: `unknown tool ${params.name}` } };
      try {
        const r = tool.run(loadProject(root), params.arguments ?? {});
        return reply({ content: [{ type: "text", text: r.text }], isError: r.isError ?? false });
      } catch (e) {
        return reply({ content: [{ type: "text", text: (e as Error).message }], isError: true });
      }
    }
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${method}` } };
  }
}

export async function serve(root?: string) {
  const decoder = new TextDecoder();
  let buf = "";
  for await (const chunk of Bun.stdin.stream()) {
    buf += decoder.decode(chunk, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg: Json;
      try { msg = JSON.parse(line); } catch { process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }) + "\n"); continue; }
      const out = handle(msg, root);
      if (out) process.stdout.write(JSON.stringify(out) + "\n");
    }
  }
}

if (import.meta.main) await serve(process.argv[2]);
