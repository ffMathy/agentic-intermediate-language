// MCP server (JSON-RPC 2.0 over newline-delimited stdio). Four tools:
// look (ail_show), judge (ail_check), and the two the leaf compiler needs
// (ail_context, ail_submit). No SDK dependency on purpose.
import { formatCheck, runCheck } from "./check.ts";
import { checkPath, submit } from "./compile.ts";
import { buildContext } from "./context.ts";
import { loadProject, modulePath, type Project } from "./project.ts";
import { show } from "./show.ts";
import { formatVerify } from "./verify.ts";

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
    name: "ail_show",
    description: 'Look at the AIL spec. target: "" for the tree with each node\'s build status, a node name for its source and who uses it, "stakeholder" | "design" | "engineer" | "specialist" (with optional tag) for an audience\'s view, or "changes" (optional since: git ref) for a review of what changed.',
    inputSchema: obj({ target: str, tag: str, since: str }),
    run: (p, a) => ({ text: show(p, (a.target as string) ?? "", { tag: a.tag as string | undefined, since: a.since as string | undefined }) }),
  },
  {
    name: "ail_check",
    description: "Is the spec sound, is every node built from the current spec, and does the code pass every check the spec implies? Read-only.",
    inputSchema: obj({ nodes: { type: "array", items: str } }),
    run: (p, a) => { const r = runCheck(p, (a.nodes as string[]) ?? []); return { text: formatCheck(r), isError: !r.ok }; },
  },
  {
    name: "ail_context",
    description: "The encapsulated compile context for one node: the target, design tokens, glossary, why chain, the node, its dependencies' contracts, and (when needed) instructions for its derived check. Implement the node from this context only, then call ail_submit.",
    inputSchema: obj({ node: str }, ["node"]),
    run: (p, a) => ({ text: buildContext(p, needNode(p, a.node)) }),
  },
  {
    name: "ail_submit",
    description: "Hand in a node's module (content) and, when its context asked for one, its derived check (checks). They are written, verified against the spec and recorded — or rolled back with the failures returned. The only way to write generated code.",
    inputSchema: obj({ node: str, content: str, checks: str }, ["node", "content"]),
    run: (p, a) => {
      const n = needNode(p, a.node);
      const path = modulePath(p, n);
      if (!path) throw new Error(`${n.name} has no output path`);
      const files: Record<string, string> = { [path]: String(a.content) };
      if (typeof a.checks === "string") files[checkPath(p, n)] = a.checks;
      const r = submit(p, n, files, "mcp");
      const detail = r.verify ? formatVerify({ results: [r.verify], typecheck: null, ok: r.ok }) : "";
      return { text: r.ok ? `accepted: ${path}\n${detail}` : `rejected: ${r.error}\n${detail}`, isError: !r.ok };
    },
  },
];

export function handle(msg: Json, root?: string): Json | null {
  const id = msg.id as number | string | undefined;
  const method = msg.method as string;
  const reply = (result: Json) => ({ jsonrpc: "2.0", id, result });
  if (id === undefined) return null;
  switch (method) {
    case "initialize":
      return reply({
        protocolVersion: (msg.params as Json)?.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "ail", version: "0.2.0" },
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
