// Vendor-neutral model access. A model spec is "<provider>:<rest>":
//
//   claude-code[:<model>]            the Claude Code CLI with its own login —
//                                    a Claude subscription works, no API key
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
import { claudeCodeProvider } from "./claude-code.ts";
import { commandProvider } from "./command.ts";
import { mockProvider } from "./mock.ts";
import { openaiProvider } from "./openai.ts";

export interface CompletionRequest {
  system: string;
  prompt: string;
  /** Sampling temperature, for providers that still accept one. */
  temperature?: number;
  maxTokens?: number;
  /** Images shown before the prompt (e.g. screenshots to judge), each with a label. */
  images?: { label: string; mediaType: "image/png"; data: string }[];
  /** Which node and sample this is; used by the mock provider and for logs. */
  meta?: { node?: string; sample?: number; purpose?: string };
}

export interface Provider {
  id: string;
  complete(req: CompletionRequest): Promise<string>;
}

export const DEFAULT_MODEL = "anthropic:claude-opus-5-5";

/**
 * With an API key, call the API directly. Without one, fall back to the
 * Claude Code CLI if it is installed, so a Claude subscription just works.
 */
export function defaultModel(env: Record<string, string | undefined> = process.env, which: (cmd: string) => string | null = Bun.which): string {
  if (env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN) return DEFAULT_MODEL;
  if (which("claude")) return "claude-code";
  return DEFAULT_MODEL;
}

/** Why a model spec can't be used here (e.g. CI without a login), or null when it can. */
export function modelUnavailable(spec: string, env: Record<string, string | undefined> = process.env, which: (cmd: string) => string | null = Bun.which): string | null {
  const kind = spec.split(":")[0];
  if (kind === "claude-code") return which("claude") ? null : "Claude Code is not installed";
  if (kind === "anthropic") return env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN ? null : "ANTHROPIC_API_KEY is not set, and Claude Code is not installed";
  if (kind === "openai") return env.OPENAI_API_KEY || env.OPENAI_BASE_URL ? null : "OPENAI_API_KEY is not set";
  return null;
}

export function getProvider(spec: string): Provider {
  const at = spec.indexOf(":");
  const kind = at < 0 ? spec : spec.slice(0, at);
  const rest = at < 0 ? "" : spec.slice(at + 1);
  switch (kind) {
    case "anthropic": return anthropicProvider(rest || "claude-opus-5-5");
    case "claude-code": return claudeCodeProvider(rest);
    case "openai": return openaiProvider(rest);
    case "command": return commandProvider(rest);
    case "mock": return mockProvider(rest);
    default: throw new Error(`unknown model provider "${kind}" in "${spec}" (use claude-code, anthropic:, openai:, command: or mock:)`);
  }
}

export function resolveModels(cli: string[], config?: string[]): string[] {
  if (cli.length) return cli;
  if (process.env.AIL_MODELS) return process.env.AIL_MODELS.split(",").map((s) => s.trim()).filter(Boolean);
  if (config?.length) return config;
  return [defaultModel()];
}
