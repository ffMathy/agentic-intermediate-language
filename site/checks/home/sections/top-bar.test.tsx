// ail-derived-from: TopBar@0c641abfafc9e174
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
  const names = links.map((link) => (link.textContent ?? "").trim());
  expect(names).toEqual([
    "The journey",
    "Four readers",
    "How it builds",
    "Adopt an app",
    "Browse the specs",
    "Get started",
    "GitHub ↗",
  ]);
  const hrefs = links.map((link) => link.getAttribute("href"));
  expect(hrefs).toEqual([
    "#journey",
    "#readers",
    "#loop",
    "#adopt",
    "#specs",
    "#start",
    "https://github.com/ffMathy/agentic-intermediate-language",
  ]);
});
