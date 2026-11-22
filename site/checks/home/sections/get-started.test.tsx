// ail-derived-from: GetStarted@605c2e41e45dcd8b
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

const DOCUMENT_POSITION_FOLLOWING = 4;

function follows(first: Node, second: Node): boolean {
  return (first.compareDocumentPosition(second) & DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function copyButtonNames(card: HTMLElement): string[] {
  return within(card)
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? button.textContent ?? "");
}

function expectInOrder(names: string[], commands: string[]): void {
  const positions = commands.map((command) => names.indexOf(`Copy ${command}`));
  for (const position of positions) {
    expect(position).toBeGreaterThanOrEqual(0);
  }
  for (let i = 1; i < positions.length; i += 1) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  }
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  within(card).getByRole("button", {
    name: "Copy /plugin marketplace add ffMathy/agentic-intermediate-language",
  });
  within(card).getByRole("button", {
    name: "Copy /plugin install ail@agentic-intermediate-language",
  });
  expectInOrder(copyButtonNames(card), [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ]);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  within(card).getByRole("button", {
    name: "Copy bun add -g github:ffMathy/agentic-intermediate-language",
  });

  const table = within(card).getByRole("table");
  const rows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("columnheader").length === 0);
  const cells = rows.map((row) =>
    Array.from(row.querySelectorAll("td, th")).map((cell) => (cell.textContent ?? "").trim()),
  );
  expect(cells.map((row) => row[0])).toEqual(["ail build", "ail show [what]", "ail adopt"]);
  expect(cells.map((row) => row[1])).toEqual([
    "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
    "The tree, one node, or what changed since a git ref.",
    "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same.",
  ]);

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(follows(table, where)).toBe(true);

  const demoCommands = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show",
  ];
  for (const command of demoCommands) {
    within(card).getByRole("button", { name: `Copy ${command}` });
  }
  expectInOrder(copyButtonNames(card), demoCommands);
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", { level: 2, name: "Start in two minutes" });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expect(follows(heading, lead)).toBe(true);

  const lastCard = screen.getByRole("region", { name: "In a terminal" });
  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe("https://github.com/ffMathy/agentic-intermediate-language");
  expect(follows(lastCard, example)).toBe(true);
  expect(follows(example, repo)).toBe(true);
});
