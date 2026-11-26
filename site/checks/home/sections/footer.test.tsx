// ail-derived-from: Footer@afd20054e2240e56
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Footer } from "../../../src/gen/home/sections/footer";

afterEach(() => {
  cleanup();
});

test("the links", () => {
  render(<Footer />);

  const expected: Array<[string, string]> = [
    ["Shapeshifter", "https://github.com/ffMathy/Shapeshifter"],
    ["Valafind", "https://github.com/ffMathy/valafind"],
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
      "Cursor guide",
      "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/cursor.md",
    ],
    [
      "Copilot guide",
      "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/copilot.md",
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
