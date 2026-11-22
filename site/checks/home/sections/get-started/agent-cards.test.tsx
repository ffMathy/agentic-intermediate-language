// ail-derived-from: AgentCards@7870ae4ce67c4f53
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { AgentCards } from "../../../../src/gen/home/sections/get-started/agent-cards";

afterEach(() => {
  cleanup();
});

test("in Cursor", () => {
  render(<AgentCards />);
  const card = screen.getByRole("region", { name: "In Cursor" });
  const text = card.textContent ?? "";
  expect(text).toContain(
    "git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail",
  );
  expect(text).toContain("Developer: Reload Window");
  expect(text).toContain("team marketplace");
});

test("in GitHub Copilot", () => {
  render(<AgentCards />);
  const card = screen.getByRole("region", { name: "In GitHub Copilot" });
  const text = card.textContent ?? "";
  const first = "copilot plugin marketplace add ffMathy/agentic-intermediate-language";
  const second = "copilot plugin install ail@agentic-intermediate-language";
  const firstIndex = text.indexOf(first);
  const secondIndex = text.indexOf(second);
  expect(firstIndex).toBeGreaterThanOrEqual(0);
  expect(secondIndex).toBeGreaterThanOrEqual(0);
  expect(firstIndex).toBeLessThan(secondIndex);
  expect(text).toContain("In VS Code, add the same repository");
});
