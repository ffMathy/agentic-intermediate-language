// `ail lift`: existing code → a draft IL node, for bootstrapping and for
// bringing hand edits of generated code back into the spec.
import { readFileSync } from "node:fs";
import { loadSkill } from "./compile.ts";
import { parseFile } from "./parse.ts";
import type { Project } from "./project.ts";
import type { Provider } from "./providers/index.ts";

export async function lift(p: Project, file: string, provider: Provider, hints: { name?: string; level?: string; kind?: string; existing?: string } = {}): Promise<{ il: string; errors: string[] }> {
  const code = readFileSync(file, "utf8");
  const prompt = [
    p.profile ? `Profile: ${p.profile.id}\n${p.profile.order.map((k) => `- ${k}: ${p.profile!.settings[k]}`).join("\n")}` : "",
    p.glossary.length ? `Glossary:\n${p.glossary.map((t) => `- ${t.term}: ${t.plain} (${t.formal})`).join("\n")}` : "",
    `Known nodes: ${[...p.nodes.keys()].join(", ") || "(none)"}`,
    hints.existing ? `The current IL for this node (update it; keep what still holds):\n\`\`\`ail\n${hints.existing}\n\`\`\`` : "",
    `Hints: ${JSON.stringify(hints)}`,
    `Source file ${file}:\n\`\`\`\n${code}\n\`\`\``,
    "Reply with one ```ail fenced block containing the node(s), nothing else.",
  ].filter(Boolean).join("\n\n");
  const raw = await provider.complete({ system: loadSkill("ail-lift"), prompt, meta: { node: hints.name ?? file, purpose: "lift" } });
  const parsed = parseFile("<lift>", raw.includes("```ail") ? raw : "```ail\n" + raw + "\n```");
  return { il: raw.trim(), errors: [...parsed.errors.map((e) => e.message), ...(parsed.nodes.length ? [] : ["no node in the reply"])] };
}
