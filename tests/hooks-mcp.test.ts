import { expect, test } from "bun:test";
import { postHook, preHook } from "../src/hooks.ts";
import { handle } from "../src/mcp.ts";
import { join } from "node:path";
import { KATA } from "./helpers.ts";

test("pre hook blocks edits to generated files only", () => {
  expect(preHook({ tool_input: { file_path: "src/gen/rules.ts" } }, KATA).code).toBe(2);
  expect(preHook({ tool_input: { file_path: "src/gen/main.tsx" } }, KATA).code).toBe(2);
  expect(preHook({ tool_input: { file_path: "index.html" } }, KATA).code).toBe(0);
  expect(preHook({ tool_input: { file_path: "tictactoe.ail.md" } }, KATA).code).toBe(0);
  expect(preHook({ tool_input: { file_path: "checks/rules.test.ts" } }, KATA).code).toBe(0);
});

test("post hook lints IL edits", () => {
  expect(postHook({ tool_input: { file_path: "tictactoe.ail.md" } }, KATA).code).toBe(0);
  expect(postHook({ tool_input: { file_path: "README.md" } }, KATA).code).toBe(0);
});

test("MCP: initialize, list and call", () => {
  const init = handle({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } }, KATA) as any;
  expect(init.result.serverInfo.name).toBe("ail");
  const list = handle({ jsonrpc: "2.0", id: 2, method: "tools/list" }, KATA) as any;
  expect(list.result.tools.map((t: { name: string }) => t.name)).toContain("ail_submit");
  const call = handle({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "ail_context", arguments: { node: "Rules" } } }, KATA) as any;
  expect(call.result.isError).toBe(false);
  expect(call.result.content[0].text).toContain("# AIL compile context: Rules");
  const bad = handle({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "ail_show", arguments: { target: "Nope" } } }, KATA) as any;
  expect(bad.result.isError).toBe(true);
  expect(handle({ jsonrpc: "2.0", method: "notifications/initialized" }, KATA)).toBeNull();
});

test("hooks find the project from the edited file, and ignore files outside AIL projects", () => {
  const root = join(KATA, "..", "..");
  expect(preHook({ tool_input: { file_path: join(KATA, "src/gen/rules.ts") } }, root).code).toBe(2);
  expect(preHook({ tool_input: { file_path: join(root, "src/cli.ts") } }, root).code).toBe(0);
});

test("the MCP surface is four tools", () => {
  const list = handle({ jsonrpc: "2.0", id: 1, method: "tools/list" }, KATA) as any;
  expect(list.result.tools.map((t: { name: string }) => t.name)).toEqual(["ail_show", "ail_check", "ail_context", "ail_submit"]);
});
