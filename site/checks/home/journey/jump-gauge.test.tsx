// ail-derived-from: JumpGauge@03ab15419b2572e7
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JumpGauge } from "../../../src/gen/home/journey/jump-gauge";

afterEach(() => {
  cleanup();
});

test("every pill leads to its stop", () => {
  render(<JumpGauge />);
  const nav = screen.getByRole("navigation", { name: "Journey stops" });
  const expectedNames = [
    "1 Idea",
    "2 Product",
    "3 Experience",
    "4 System",
    "5 Specialist",
    "6 Build",
    "7 Proof",
    "8 Play",
  ];
  for (const name of expectedNames) {
    expect(within(nav).getByRole("link", { name })).toBeTruthy();
  }
  const links = within(nav)
    .getAllByRole("link")
    .filter((link) => expectedNames.includes((link.textContent ?? "").trim()));
  expect(links.map((link) => (link.textContent ?? "").trim())).toEqual(
    expectedNames,
  );
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "#stop-1",
    "#stop-2",
    "#stop-3",
    "#stop-4",
    "#stop-5",
    "#stop-6",
    "#stop-7",
    "#stop-8",
  ]);
});
