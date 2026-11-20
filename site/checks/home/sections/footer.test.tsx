// ail-derived-from: Footer@a7709adb9c15810f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Footer } from "../../../src/gen/home/sections/footer";

afterEach(() => {
  cleanup();
});

test("the links", () => {
  render(<Footer />);

  const expected: Array<[string, string]> = [
    ["GitHub", "https://github.com/ffMathy/agentic-intermediate-language"],
    [
      "Design proposal",
      "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md",
    ],
    [
      "Language definition",
      "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md",
    ],
    [
      "Claude Code guide",
      "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md",
    ],
    [
      "This site's spec",
      "https://github.com/ffMathy/agentic-intermediate-language/tree/main/site",
    ],
  ];

  for (const [name, href] of expected) {
    const link = screen.getByRole("link", { name });
    expect(link.getAttribute("href")).toBe(href);
  }
});
