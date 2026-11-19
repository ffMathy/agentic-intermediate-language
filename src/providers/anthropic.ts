import type Anthropic from "@anthropic-ai/sdk";
import type { CompletionRequest, Provider } from "./index.ts";

// Current Claude models reject sampling parameters (temperature/top_p), so
// variance is controlled by the spec and by `effort`, not by temperature.
// Effort defaults to "high" for compilation (AIL_EFFORT overrides it).
export function anthropicProvider(model: string): Provider {
  let client: Anthropic | null = null;
  return {
    id: `anthropic:${model}`,
    async complete(req: CompletionRequest) {
      // Loaded lazily so hooks and the MCP server work without the SDK installed.
      client ??= new (await import("@anthropic-ai/sdk")).default();
      const stream = client.beta.messages.stream({
        model,
        max_tokens: req.maxTokens ?? 64000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        output_config: { effort: (process.env.AIL_EFFORT as "low" | "medium" | "high" | "xhigh" | "max") ?? "high" },
        system: req.system,
        messages: [{ role: "user", content: req.images?.length
          ? [...req.images.flatMap((im) => [
              { type: "text", text: im.label },
              { type: "image", source: { type: "base64", media_type: im.mediaType, data: im.data } },
            ]), { type: "text", text: req.prompt }]
          : req.prompt }],
      } as Parameters<Anthropic["beta"]["messages"]["stream"]>[0]);
      const message = await stream.finalMessage();
      if (message.stop_reason === "refusal") throw new Error(`model declined the request (${model})`);
      if (message.stop_reason === "max_tokens") throw new Error(`output truncated at max_tokens (${model})`);
      return message.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    },
  };
}
