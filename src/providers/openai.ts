import type { CompletionRequest, Provider } from "./index.ts";

// Any OpenAI-compatible chat completions endpoint: OpenAI, Azure, OpenRouter,
// Ollama, vLLM, LM Studio... Configure with OPENAI_BASE_URL and OPENAI_API_KEY.
export function openaiProvider(model: string): Provider {
  if (!model) throw new Error('openai provider needs a model, e.g. "openai:gpt-5"');
  return {
    id: `openai:${model}`,
    async complete(req: CompletionRequest) {
      const base = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.OPENAI_API_KEY ? { authorization: `Bearer ${process.env.OPENAI_API_KEY}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: req.system }, { role: "user", content: req.images?.length
            ? [...req.images.flatMap((im) => [
                { type: "text", text: im.label },
                { type: "image_url", image_url: { url: `data:${im.mediaType};base64,${im.data}` } },
              ]), { type: "text", text: req.prompt }]
            : req.prompt }],
          ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        }),
      });
      if (!res.ok) throw new Error(`${model}: HTTP ${res.status} ${await res.text()}`);
      const json = (await res.json()) as { choices: { message: { content: string } }[] };
      return json.choices[0]?.message.content ?? "";
    },
  };
}
