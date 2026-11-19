// ail-derived-from: Footer@13b2a7046de63b72
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Footer } from "../../../src/gen/home/sections/footer";

afterEach(() => {
  cleanup();
});

test("the links", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
  expect(
    screen.getByRole("link", { name: "Design proposal" }).getAttribute("href"),
  ).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md",
  );
  expect(
    screen.getByRole("link", { name: "Claude Code guide" }).getAttribute("href"),
  ).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md",
  );
  expect(
    screen.getByRole("link", { name: "This site's spec" }).getAttribute("href"),
  ).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/site",
  );
});
