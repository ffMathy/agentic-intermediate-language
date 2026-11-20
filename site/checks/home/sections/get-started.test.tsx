// ail-derived-from: GetStarted@3e1747bc1f227382
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

const FOLLOWING = 4;

afterEach(() => {
  cleanup();
});

function follows(a: Element, b: Element): boolean {
  return (a.compareDocumentPosition(b) & FOLLOWING) !== 0;
}

function expectInOrder(elements: Element[]): void {
  for (let i = 1; i < elements.length; i++) {
    expect(follows(elements[i - 1], elements[i])).toBe(true);
  }
}

function commandButtons(card: HTMLElement, commands: string[]): HTMLElement[] {
  return commands.map((command) => {
    expect(card.textContent ?? "").toContain(command);
    return within(card).getByRole("button", { name: `Copy ${command}` });
  });
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  const buttons = commandButtons(card, [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ]);
  expectInOrder(buttons);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });

  commandButtons(card, ["bun add -g github:ffMathy/agentic-intermediate-language"]);

  const table = within(card).getByRole("table");
  const dataRows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("columnheader").length === 0);
  const rows = dataRows.map((row) =>
    Array.from(row.querySelectorAll("th, td")).map((cell) => (cell.textContent ?? "").trim()),
  );
  expect(rows.map((cells) => cells[0])).toEqual(["ail build", "ail show [what]", "ail adopt"]);
  expect(rows[0][1]).toBe(
    "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
  );
  expect(rows[1][1]).toBe("The tree, a node, one reader's view, or what changed.");
  expect(rows[2][1]).toBe(
    "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same.",
  );

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(follows(table, where)).toBe(true);

  const buttons = commandButtons(card, [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show stakeholder",
  ]);
  expectInOrder(buttons);
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", { level: 2, name: "Start in two minutes" });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expect(follows(heading, lead)).toBe(true);

  const claude = screen.getByRole("region", { name: "In Claude Code" });
  const cli = screen.getByRole("region", { name: "In a terminal" });
  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });

  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe("https://github.com/ffMathy/agentic-intermediate-language");

  expect(follows(claude, example)).toBe(true);
  expect(follows(cli, example)).toBe(true);
  expect(claude.contains(example)).toBe(false);
  expect(cli.contains(example)).toBe(false);
  expect(follows(example, repo)).toBe(true);
});
