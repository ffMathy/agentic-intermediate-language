// ail-derived-from: Footer@cdcac42a6c4578ba
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Footer } from "../../../src/gen/home/sections/footer";

afterEach(() => {
  cleanup();
});

test("the links", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Design" }).getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md",
  );
  expect(screen.getByRole("link", { name: "Source" }).getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
  expect(screen.getByRole("link", { name: "Demo spec" }).getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
});
