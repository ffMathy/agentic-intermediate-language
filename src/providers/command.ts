import type { CompletionRequest, Provider } from "./index.ts";

// Pipe the prompt through any CLI: "command:claude -p", "command:codex exec -",
// "command:ollama run qwen3-coder". The system prompt is prepended to stdin.
// AIL_TEMPERATURE is exported for wrappers that can use it.
export function commandProvider(cmd: string): Provider {
  if (!cmd) throw new Error('command provider needs a command, e.g. "command:claude -p"');
  return {
    id: `command:${cmd}`,
    async complete(req: CompletionRequest) {
      const proc = Bun.spawn(["sh", "-c", cmd], {
        stdin: new TextEncoder().encode(`${req.system}\n\n---\n\n${req.prompt}`),
        stdout: "pipe",
        stderr: "pipe",
        env: { ...process.env, ...(req.temperature !== undefined ? { AIL_TEMPERATURE: String(req.temperature) } : {}) },
      });
      const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      if (code !== 0) throw new Error(`"${cmd}" exited with ${code}: ${err.trim()}`);
      return out;
    },
  };
}
