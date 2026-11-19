// ail-derived-from: GetStarted@5f50c1018bac9697
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function expectInOrder(text: string, parts: string[]): void {
  let from = 0;
  for (const part of parts) {
    const at = text.indexOf(part, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + part.length;
  }
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  const text = card.textContent ?? "";
  expectInOrder(text, [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ]);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  expect(card.textContent ?? "").toContain(
    "bun add -g github:ffMathy/agentic-intermediate-language",
  );

  const table = within(card).getByRole("table");
  const dataRows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("cell").length > 0);

  const expected: Array<[string, string]> = [
    [
      "ail check",
      "Is the spec sound, is the code built from it, and does it pass every check?",
    ],
    ["ail build", "Compile whatever changed."],
    [
      "ail show [what]",
      "The tree, a node, one reader's view, or what changed.",
    ],
  ];

  expect(dataRows.length).toBe(expected.length);
  dataRows.forEach((row, i) => {
    const cells = within(row).getAllByRole("cell");
    expect((cells[0].textContent ?? "").trim()).toBe(expected[i][0]);
    expect(row.textContent ?? "").toContain(expected[i][1]);
  });
});
