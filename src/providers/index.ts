// Vendor-neutral model access. A model spec is "<provider>:<rest>":
//
//   anthropic:claude-opus-5-5        Anthropic Messages API (official SDK)
//   openai:<model>                   any OpenAI-compatible /chat/completions
//                                    endpoint (OPENAI_BASE_URL, OPENAI_API_KEY)
//   command:<shell command>          prompt on stdin, completion on stdout —
//                                    e.g. "command:claude -p", "command:codex exec -"
//   mock:<file.json>                 canned responses for tests and demos
//
// The compile loop is plain code around these calls, so it behaves the same
// whichever vendor fills in the leaves.
import { anthropicProvider } from "./anthropic.ts";
import { commandProvider } from "./command.ts";
import { mockProvider } from "./mock.ts";
import { openaiProvider } from "./openai.ts";

export interface CompletionRequest {
  system: string;
  prompt: string;
  /** Sampling temperature, for providers that still accept one. */
  temperature?: number;
  maxTokens?: number;
  /** Which node and sample this is; used by the mock provider and for logs. */
  meta?: { node?: string; sample?: number; purpose?: string };
}

export interface Provider {
  id: string;
  complete(req: CompletionRequest): Promise<string>;
}

export const DEFAULT_MODEL = "anthropic:claude-opus-5-5";

export function getProvider(spec: string): Provider {
  const at = spec.indexOf(":");
  const kind = at < 0 ? spec : spec.slice(0, at);
  const rest = at < 0 ? "" : spec.slice(at + 1);
  switch (kind) {
    case "anthropic": return anthropicProvider(rest || "claude-opus-5-5");
    case "openai": return openaiProvider(rest);
    case "command": return commandProvider(rest);
    case "mock": return mockProvider(rest);
    default: throw new Error(`unknown model provider "${kind}" in "${spec}" (use anthropic:, openai:, command: or mock:)`);
  }
}

export function resolveModels(cli: string[], config?: string[]): string[] {
  if (cli.length) return cli;
  if (process.env.AIL_MODELS) return process.env.AIL_MODELS.split(",").map((s) => s.trim()).filter(Boolean);
  if (config?.length) return config;
  return [DEFAULT_MODEL];
}
