// ail-derived-from: JumpGauge@8a034974f19bda5d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JumpGauge } from "../../../../src/gen/home/journey/jump-gauge/jump-gauge";

afterEach(() => {
  cleanup();
});

const names = [
  "1 Idea",
  "2 Product",
  "3 Experience",
  "4 System",
  "5 Specialist",
  "6 Build",
  "7 Proof",
  "8 Play",
];

test("every pill leads to its stop", () => {
  render(<JumpGauge />);
  const nav = screen.getByRole("navigation", { name: "Journey stops" });
  const links = within(nav).getAllByRole("link");
  expect(links.length).toBe(8);
  links.forEach((link, i) => {
    expect((link.textContent ?? "").trim()).toBe(names[i]);
    expect(link.getAttribute("href")).toBe(`#stop-${i + 1}`);
  });
  names.forEach((name, i) => {
    const link = within(nav).getByRole("link", { name });
    expect(link.getAttribute("href")).toBe(`#stop-${i + 1}`);
  });
});

test("the gauge shows which stops are the spec", () => {
  render(<JumpGauge />);
  const nav = screen.getByRole("navigation", { name: "Journey stops" });
  const specLabel = within(nav).getByText("The spec: four levels");
  const outLabel = within(nav).getByText("What it becomes");
  const product = within(nav).getByRole("link", { name: "2 Product" });
  const build = within(nav).getByRole("link", { name: "6 Build" });
  expect(
    specLabel.compareDocumentPosition(product) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(
    outLabel.compareDocumentPosition(build) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});
