// ail-derived-from: GetStarted@c958a1720161d460
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function precedes(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function expectCommandsInOrder(card: HTMLElement, commands: string[]): void {
  const text = card.textContent ?? "";
  let last = -1;
  for (const command of commands) {
    const at = text.indexOf(command, last + 1);
    expect(at).toBeGreaterThan(last);
    last = at;
  }
  const buttons = commands.map((command) =>
    within(card).getByRole("button", { name: `Copy ${command}` }),
  );
  for (let i = 1; i < buttons.length; i++) {
    expect(precedes(buttons[i - 1], buttons[i])).toBe(true);
  }
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  expectCommandsInOrder(card, [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ]);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });

  const install = "bun add -g github:ffMathy/agentic-intermediate-language";
  expect(card.textContent ?? "").toContain(install);
  within(card).getByRole("button", { name: `Copy ${install}` });

  const table = within(card).getByRole("table");
  const dataRows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("columnheader").length === 0);
  const expected = ["ail check", "ail build", "ail show [what]"];
  expect(dataRows.length).toBe(expected.length);
  dataRows.forEach((row, i) => {
    const cells = within(row).getAllByRole("cell");
    expect(cells.length).toBeGreaterThanOrEqual(2);
    expect((cells[0].textContent ?? "").trim()).toBe(expected[i]);
    expect((cells[1].textContent ?? "").trim().length).toBeGreaterThan(0);
  });

  const where = within(card).getByText((_, element) =>
    element !== null &&
    element.tagName.toLowerCase() === "p" &&
    (element.textContent ?? "").includes("ail.config.json"),
  );
  expect(precedes(table, where)).toBe(true);

  const steps = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail check",
    "ail show stakeholder",
  ];
  expectCommandsInOrder(card, steps);
  const first = within(card).getByRole("button", { name: `Copy ${steps[0]}` });
  expect(precedes(where, first)).toBe(true);
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", { level: 2, name: "Start in two minutes" });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expect(precedes(heading, lead)).toBe(true);

  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
  expect(precedes(example, repo)).toBe(true);

  const claude = screen.getByRole("region", { name: "In Claude Code" });
  const cli = screen.getByRole("region", { name: "In a terminal" });
  for (const card of [claude, cli]) {
    expect(card.contains(example)).toBe(false);
    expect(precedes(card, example)).toBe(true);
  }
});
