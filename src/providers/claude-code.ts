import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CompletionRequest, Provider } from "./index.ts";

// Uses the Claude Code CLI and whatever it is logged in with: a Claude
// subscription (Pro/Max/Team/Enterprise) or an API key. No ail-side key needed.
//
// The call is a pure completion: built-in tools, MCP servers and slash
// commands are off, and it runs in an empty directory so no project file or
// CLAUDE.md can leak into a node's encapsulated context.
export function claudeCodeProvider(model: string): Provider {
  return {
    id: model ? `claude-code:${model}` : "claude-code",
    async complete(req: CompletionRequest) {
      const cwd = mkdtempSync(join(tmpdir(), "ail-claude-"));
      try {
        // Images go in as one stream-json user message; text-only calls stay plain.
        const images = req.images ?? [];
        const stdin = images.length
          ? JSON.stringify({ type: "user", message: { role: "user", content: [
              ...images.flatMap((im) => [{ type: "text", text: im.label }, { type: "image", source: { type: "base64", media_type: im.mediaType, data: im.data } }]),
              { type: "text", text: req.prompt },
            ] } }) + "\n"
          : req.prompt;
        const args = [
          "claude", "-p",
          ...(images.length ? ["--input-format", "stream-json", "--output-format", "stream-json", "--verbose"] : ["--output-format", "text"]),
          "--tools", "",
          "--strict-mcp-config",
          "--disable-slash-commands",
          "--no-session-persistence",
          "--system-prompt", req.system,
          ...(model ? ["--model", model] : []),
        ];
        const proc = Bun.spawn(args, { cwd, stdin: new TextEncoder().encode(stdin), stdout: "pipe", stderr: "pipe" });
        const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
        if (code !== 0) throw new Error(`claude -p exited with ${code}: ${(err || out).trim().split("\n").slice(-3).join(" ")} (is Claude Code installed and logged in? run \`claude\` once)`);
        if (!images.length) return out;
        const result = out.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).find((e) => e?.type === "result");
        if (!result || result.is_error) throw new Error(`claude -p gave no result: ${(result?.result ?? out).toString().slice(-300)}`);
        return String(result.result ?? "");
      } finally {
        rmSync(cwd, { recursive: true, force: true });
      }
    },
  };
}
