// ail-derived-from: GetStarted@cde2a95b0ba44415
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

const precedes = (a: Node, b: Node): boolean =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

const expectCommandsInOrder = (container: HTMLElement, commands: string[]): void => {
  const scope = within(container);
  const buttons = commands.map((command) => {
    expect(container.textContent ?? "").toContain(command);
    return scope.getByRole("button", { name: `Copy ${command}` });
  });
  for (let i = 1; i < buttons.length; i++) {
    expect(precedes(buttons[i - 1], buttons[i])).toBe(true);
  }
};

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
  const scope = within(card);

  const install = scope.getByRole("button", {
    name: "Copy bun add -g github:ffMathy/agentic-intermediate-language",
  });
  expect(card.textContent ?? "").toContain(
    "bun add -g github:ffMathy/agentic-intermediate-language",
  );

  const table = scope.getByRole("table");
  const rows = within(table).getAllByRole("row");
  const expected: Array<[string, string]> = [
    ["ail check", "Is the spec sound, is the code built from it, and does it pass every check?"],
    ["ail build", "Compile whatever changed."],
    ["ail show [what]", "The tree, a node, one reader's view, or what changed."],
  ];
  const bodyRows = rows.filter((row) => within(row).queryAllByRole("cell").length > 0);
  expect(bodyRows.length).toBe(expected.length);
  bodyRows.forEach((row, i) => {
    const cells = within(row).getAllByRole("cell");
    expect((cells[0].textContent ?? "").trim()).toBe(expected[i][0]);
    expect((cells[1].textContent ?? "").trim()).toBe(expected[i][1]);
  });

  const where = scope.getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(precedes(table, where)).toBe(true);

  const steps = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail check",
    "ail show stakeholder",
  ];
  expectCommandsInOrder(card, steps);
  const firstStep = scope.getByRole("button", { name: `Copy ${steps[0]}` });
  expect(precedes(where, firstStep)).toBe(true);
  expect(precedes(install, table)).toBe(true);
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

  const claudeCard = screen.getByRole("region", { name: "In Claude Code" });
  const cliCard = screen.getByRole("region", { name: "In a terminal" });
  expect(precedes(claudeCard, example)).toBe(true);
  expect(precedes(cliCard, example)).toBe(true);
  expect(claudeCard.contains(example)).toBe(false);
  expect(cliCard.contains(example)).toBe(false);
});
