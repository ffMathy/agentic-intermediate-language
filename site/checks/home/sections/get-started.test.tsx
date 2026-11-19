// ail-derived-from: GetStarted@10143132ad777be3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

const FOLLOWING = 4;

function follows(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & FOLLOWING) !== 0;
}

function expectInOrder(nodes: Node[]): void {
  for (let i = 0; i + 1 < nodes.length; i++) {
    expect(follows(nodes[i], nodes[i + 1])).toBe(true);
  }
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  const commands = [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ];
  const text = card.textContent ?? "";
  for (const command of commands) {
    expect(text).toContain(command);
  }
  const buttons = commands.map((command) =>
    within(card).getByRole("button", { name: `Copy ${command}` }),
  );
  expectInOrder(buttons);
  expect(text.indexOf(commands[0])).toBeLessThan(text.indexOf(commands[1]));
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  const text = card.textContent ?? "";

  const install = "bun add -g github:ffMathy/agentic-intermediate-language";
  expect(text).toContain(install);
  const installButton = within(card).getByRole("button", { name: `Copy ${install}` });

  const table = within(card).getByRole("table");
  const rows = within(table).getAllByRole("row");
  const bodyRows = rows.filter((row) => {
    const first = row.querySelector("td, th");
    const label = first?.textContent?.trim() ?? "";
    return label === "ail build" || label === "ail show [what]";
  });
  expect(bodyRows.map((row) => row.querySelector("td, th")?.textContent?.trim())).toEqual([
    "ail build",
    "ail show [what]",
  ]);
  expect(bodyRows[0].textContent).toContain(
    "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
  );
  expect(bodyRows[1].textContent).toContain(
    "The tree, a node, one reader's view, or what changed.",
  );

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(follows(table, where)).toBe(true);

  const steps = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show stakeholder",
  ];
  for (const step of steps) {
    expect(text).toContain(step);
  }
  const stepButtons = steps.map((step) =>
    within(card).getByRole("button", { name: `Copy ${step}` }),
  );
  expectInOrder(stepButtons);
  expect(follows(installButton, table)).toBe(true);
  expect(follows(where, stepButtons[0])).toBe(true);
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
  expect(repo.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );

  expect(follows(claude, example)).toBe(true);
  expect(follows(cli, example)).toBe(true);
  expect(claude.contains(example)).toBe(false);
  expect(cli.contains(example)).toBe(false);
  expect(follows(example, repo)).toBe(true);
});
