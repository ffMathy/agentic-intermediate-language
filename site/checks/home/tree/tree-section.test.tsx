// ail-derived-from: TreeSection@36d2ff31b7615f1a
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
  const scope = within(section as HTMLElement);

  const h2 = scope.getByRole("heading", {
    level: 2,
    name: "A tree of tasks, the same all the way down",
  });
  expect(h2).toBeTruthy();

  const expected = [
    "One shape at every level",
    "Built one node at a time",
    "Checked node by node",
  ];
  for (const name of expected) {
    expect(scope.getByRole("heading", { level: 3, name })).toBeTruthy();
  }
  const h3Names = scope
    .getAllByRole("heading", { level: 3 })
    .map((el) => (el.textContent ?? "").trim())
    .filter((name) => expected.includes(name));
  expect(h3Names).toEqual(expected);

  const link = scope.getByRole("link", {
    name: "Read the paper (arXiv:2512.24601) ↗",
  });
  expect(link.getAttribute("href")).toBe("https://arxiv.org/abs/2512.24601");
});
