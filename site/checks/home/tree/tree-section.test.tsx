// ail-derived-from: TreeSection@80dda392218faef9
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { TreeSection } from "../../../src/gen/home/tree/tree-section";

afterEach(() => {
  cleanup();
});

test("the tree is explained", () => {
  const { container } = render(<TreeSection />);

  const section = container.querySelector("#tree");
  expect(section).not.toBeNull();
  const inSection = within(section as HTMLElement);

  const heading = inSection.getByRole("heading", {
    level: 2,
    name: "A tree of tasks, the same all the way down",
  });
  expect(heading).toBeTruthy();

  const expected = [
    "One shape at every level",
    "Built one node at a time",
    "Checked node by node",
  ];
  const level3Names = inSection
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  const found = level3Names.filter((name) => expected.includes(name));
  expect(found).toEqual(expected);

  const link = inSection.getByRole("link", {
    name: "Read the paper (arXiv:2512.24601) ↗",
  });
  expect(link.getAttribute("href")).toBe("https://arxiv.org/abs/2512.24601");
});
