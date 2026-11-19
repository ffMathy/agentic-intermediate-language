// ail-derived-from: GetStarted@410ce81e67b6265f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function expectInOrder(elements: Element[]): void {
  for (let i = 1; i < elements.length; i += 1) {
    const relation = elements[i - 1].compareDocumentPosition(elements[i]);
    expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
}

function expectCommandsInOrder(region: HTMLElement, commands: string[]): void {
  const buttons = commands.map((command) =>
    within(region).getByRole("button", { name: `Copy ${command}` }),
  );
  const text = region.textContent ?? "";
  for (const command of commands) {
    expect(text).toContain(command);
  }
  expectInOrder(buttons);
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

  const install = within(card).getByRole("button", {
    name: "Copy bun add -g github:ffMathy/agentic-intermediate-language",
  });
  expect(card.textContent ?? "").toContain(
    "bun add -g github:ffMathy/agentic-intermediate-language",
  );

  const table = within(card).getByRole("table");
  const rows = within(table).getAllByRole("row");
  const expected: [string, string][] = [
    [
      "ail check",
      "Is the spec sound, is the code built from it, and does it pass every check?",
    ],
    ["ail build", "Compile whatever changed."],
    ["ail show [what]", "The tree, a node, one reader's view, or what changed."],
  ];
  const bodyRows = rows.filter((row) =>
    expected.some(([command]) => {
      const cells = row.querySelectorAll("td, th");
      return cells.length > 0 && (cells[0].textContent ?? "").trim() === command;
    }),
  );
  expect(bodyRows.length).toBe(3);
  bodyRows.forEach((row, index) => {
    const cells = row.querySelectorAll("td, th");
    expect((cells[0].textContent ?? "").trim()).toBe(expected[index][0]);
    expect((cells[1]?.textContent ?? "").trim()).toBe(expected[index][1]);
  });
  expectInOrder([install, table]);

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expectInOrder([table, where]);

  const demoCommands = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail check",
    "ail show stakeholder",
  ];
  expectCommandsInOrder(card, demoCommands);
  const first = within(card).getByRole("button", { name: `Copy ${demoCommands[0]}` });
  expectInOrder([where, first]);
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", {
    level: 2,
    name: "Start in two minutes",
  });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expectInOrder([heading, lead]);

  const claude = screen.getByRole("region", { name: "In Claude Code" });
  const cli = screen.getByRole("region", { name: "In a terminal" });
  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
  expect(claude.contains(example)).toBe(false);
  expect(cli.contains(example)).toBe(false);
  expect(claude.contains(repo)).toBe(false);
  expect(cli.contains(repo)).toBe(false);
  expectInOrder([claude, example]);
  expectInOrder([cli, example]);
  expectInOrder([example, repo]);
});
