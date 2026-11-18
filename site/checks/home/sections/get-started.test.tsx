// ail-derived-from: GetStarted@4aa1281929e43ffd
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

test("in Claude Code", () => {
  render(<GetStarted />);
  const block = screen.getByRole("region", { name: "Claude Code commands" });
  expect(block.textContent).toBe(
    [
      "/plugin marketplace add ffMathy/agentic-intermediate-language",
      "/plugin install ail@agentic-intermediate-language",
      "/ail:build",
    ].join("\n"),
  );
});

test("in a terminal", () => {
  render(<GetStarted />);
  const block = screen.getByRole("region", { name: "Terminal commands" });
  expect(block.textContent).toBe(
    [
      "bun add -g github:ffMathy/agentic-intermediate-language",
      "ail check",
      "ail build",
      "ail show",
    ].join("\n"),
  );
});
