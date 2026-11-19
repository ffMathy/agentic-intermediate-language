// ail-derived-from: TopBar@2902244156a6ceab
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { TopBar } from "../../../src/gen/home/sections/top-bar";

afterEach(() => {
  cleanup();
});

test("the links lead to the right places", () => {
  render(<TopBar />);

  const nav = screen.getByRole("navigation", { name: "Sections" });
  const links = within(nav).getAllByRole("link");

  expect(links.map((link) => link.textContent)).toEqual([
    "The journey",
    "Four readers",
    "How it builds",
    "Get started",
    "GitHub ↗",
  ]);

  const expected: Array<[string, string]> = [
    ["The journey", "#journey"],
    ["Four readers", "#readers"],
    ["How it builds", "#loop"],
    ["Get started", "#start"],
    ["GitHub ↗", "https://github.com/ffMathy/agentic-intermediate-language"],
  ];

  for (const [name, href] of expected) {
    const link = within(nav).getByRole("link", { name });
    expect(link.getAttribute("href")).toBe(href);
  }
});
