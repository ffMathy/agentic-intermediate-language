// ail-derived-from: Commands@93e96ae56a685d49
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Commands } from "../../../src/gen/home/sections/commands";

afterEach(() => {
  cleanup();
});

const expected = [
  {
    command: "ail check",
    does: "Is the spec sound, is the code built from it, and does the code pass every check the spec implies?",
  },
  {
    command: "ail build",
    does: "Compile whatever changed, through Claude Code or any model, and reject anything that fails its checks.",
  },
  {
    command: "ail show",
    does: "The tree, a single node, a view for one audience, or what changed, ready for review.",
  },
];

test("three commands", () => {
  render(<Commands />);
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row");
  expect(rows.length).toBe(1 + expected.length);
  const bodyRows = rows.slice(1);
  bodyRows.forEach((row, i) => {
    const text = row.textContent ?? "";
    const { command, does } = expected[i];
    const commandAt = text.indexOf(command);
    const doesAt = text.indexOf(does);
    expect(commandAt).toBeGreaterThanOrEqual(0);
    expect(doesAt).toBeGreaterThan(commandAt);
  });
});
