// ail-derived-from: GetStarted@c3d61cb262a55efe
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function follows(first: Node, second: Node): boolean {
  return (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function expectInOrder(nodes: Node[]): void {
  for (let i = 1; i < nodes.length; i++) {
    expect(follows(nodes[i - 1], nodes[i])).toBe(true);
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
  const buttons = commands.map((command) => {
    expect(text).toContain(command);
    return within(card).getByRole("button", { name: `Copy ${command}` });
  });
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
  expect(follows(installButton, table)).toBe(true);
  const rows = within(table).getAllByRole("row");
  const bodyRows = rows
    .map((row) => Array.from(row.querySelectorAll("td, th")).map((c) => (c.textContent ?? "").trim()))
    .filter((cells) => cells[0] !== "Command");
  expect(bodyRows.map((cells) => cells[0])).toEqual([
    "ail build",
    "ail show [what]",
    "ail adopt --app <url>",
  ]);
  expect(bodyRows.map((cells) => cells[1])).toEqual([
    "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
    "The tree, a node, one reader's view, or what changed.",
    "Does the app running there behave as the spec says? For bringing an existing app under AIL, and proving a rebuilt one behaves the same.",
  ]);

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
  const stepButtons = steps.map((command) => {
    expect(text).toContain(command);
    return within(card).getByRole("button", { name: `Copy ${command}` });
  });
  expectInOrder([where, ...stepButtons]);
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
