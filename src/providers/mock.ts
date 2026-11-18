import { readFileSync } from "node:fs";
import type { CompletionRequest, Provider } from "./index.ts";

// Canned responses: a JSON file { "<Node>": ["response for sample 0", ...] }.
// A sample index beyond the list reuses the last response. Responses may be
// keyed "<Node>#<purpose>" (e.g. "Rules#derive") to answer other prompts.
export function mockProvider(file: string): Provider {
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<string, string[]>;
  const calls = new Map<string, number>();
  return {
    id: `mock:${file}`,
    async complete(req: CompletionRequest) {
      const node = req.meta?.node ?? "";
      const key = req.meta?.purpose && data[`${node}#${req.meta.purpose}`] ? `${node}#${req.meta.purpose}` : node;
      const list = data[key];
      if (!list?.length) throw new Error(`mock: no response for "${key}"`);
      const n = req.meta?.sample ?? calls.get(key) ?? 0;
      calls.set(key, n + 1);
      return list[Math.min(n, list.length - 1)]!;
    },
  };
}
