// ail-derived-from: TopBar@414844f2db23df4c
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
    ["Four readers", "#readers"],
    ["How it builds", "#loop"],
    ["Browse the specs", "#specs"],
    ["Get started", "#start"],
    ["GitHub ↗", "https://github.com/ffMathy/agentic-intermediate-language"],
  ];
  expect(links.length).toBe(expected.length);
  expected.forEach(([name, href], i) => {
    const link = links[i];
    expect(link).toBe(within(nav).getByRole("link", { name }));
    expect(link.getAttribute("href")).toBe(href);
  });
});
