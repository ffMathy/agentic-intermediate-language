// ail-derived-from: TopBar@12a89b6278589042
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

  const expected: Array<[string, string]> = [
    ["The journey", "#journey"],
    ["Watch it work", "#watch"],
    ["Four readers", "#readers"],
    ["How it builds", "#loop"],
    ["Adopt an app", "#adopt"],
    ["Browse the specs", "#specs"],
    ["Get started", "#start"],
    ["GitHub ↗", "https://github.com/ffMathy/agentic-intermediate-language"],
  ];

  expect(links.length).toBe(expected.length);

  expected.forEach(([name, href], index) => {
    const byName = within(nav).getByRole("link", { name });
    expect(links[index]).toBe(byName);
    expect(byName.getAttribute("href")).toBe(href);
  });
});
