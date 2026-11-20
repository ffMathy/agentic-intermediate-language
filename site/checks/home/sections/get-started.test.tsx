// ail-derived-from: GetStarted@0cf63493337cfddb
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

const precedes = (a: Node, b: Node): boolean =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

const copyButtonNames = (container: HTMLElement): string[] =>
  within(container)
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? "")
    .filter((name) => name.startsWith("Copy "));

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  expect(copyButtonNames(card)).toEqual([
    "Copy /plugin marketplace add ffMathy/agentic-intermediate-language",
    "Copy /plugin install ail@agentic-intermediate-language",
  ]);
  const text = card.textContent ?? "";
  const first = text.indexOf("/plugin marketplace add ffMathy/agentic-intermediate-language");
  const second = text.indexOf("/plugin install ail@agentic-intermediate-language");
  expect(first).toBeGreaterThanOrEqual(0);
  expect(second).toBeGreaterThan(first);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  const cardText = card.textContent ?? "";

  expect(cardText).toContain("bun add -g github:ffMathy/agentic-intermediate-language");
  expect(
    within(card).getByRole("button", {
      name: "Copy bun add -g github:ffMathy/agentic-intermediate-language",
    }),
  ).toBeTruthy();

  const table = within(card).getByRole("table");
  const dataRows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("columnheader").length === 0);
  const rows = dataRows.map((row) =>
    Array.from(row.querySelectorAll("td, th")).map((cell) => (cell.textContent ?? "").trim()),
  );
  expect(rows.map((cells) => cells[0])).toEqual(["ail build", "ail show [what]", "ail adopt"]);
  expect(rows.map((cells) => cells[1])).toEqual([
    "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
    "The tree, one node, or what changed since a git ref.",
    "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same.",
  ]);

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(precedes(table, where)).toBe(true);

  const steps = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show",
  ];
  const names = copyButtonNames(card);
  const stepNames = names.filter((name) => steps.map((s) => `Copy ${s}`).includes(name));
  expect(stepNames).toEqual(steps.map((s) => `Copy ${s}`));
  const buttons = steps.map((s) => within(card).getByRole("button", { name: `Copy ${s}` }));
  for (let i = 1; i < buttons.length; i += 1) {
    expect(precedes(buttons[i - 1], buttons[i])).toBe(true);
  }
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
  expect(repo.getAttribute("href")).toBe("https://github.com/ffMathy/agentic-intermediate-language");
  expect(precedes(example, repo)).toBe(true);

  const claude = screen.getByRole("region", { name: "In Claude Code" });
  const cli = screen.getByRole("region", { name: "In a terminal" });
  expect(precedes(claude, example)).toBe(true);
  expect(precedes(cli, example)).toBe(true);
});
