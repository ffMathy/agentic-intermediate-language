// ail-derived-from: GetStarted@213eb7186103829b
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

function follows(earlier: Node, later: Node): boolean {
  return (earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function copyButtonNames(region: HTMLElement): string[] {
  return within(region)
    .getAllByRole("button")
    .map((b) => b.getAttribute("aria-label") ?? b.textContent ?? "")
    .filter((name) => name.startsWith("Copy "));
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  const commands = [
    "/plugin marketplace add ffMathy/agentic-intermediate-language",
    "/plugin install ail@agentic-intermediate-language",
  ];
  expectInOrder(card.textContent ?? "", commands);
  expect(copyButtonNames(card)).toEqual(commands.map((c) => `Copy ${c}`));
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  const text = card.textContent ?? "";

  const install = "bun add -g github:ffMathy/agentic-intermediate-language";
  expect(text).toContain(install);

  const table = within(card).getByRole("table");
  const rows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("columnheader").length === 0);
  const expected = [
    ["ail build", "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look."],
    ["ail show [what]", "The tree, one node, or what changed since a git ref."],
    ["ail adopt", "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same."],
  ];
  expect(rows.length).toBe(expected.length);
  rows.forEach((row, i) => {
    const cells = within(row).getAllByRole("cell");
    expect(cells[0].textContent?.trim()).toBe(expected[i][0]);
    expect(cells[1].textContent?.trim()).toBe(expected[i][1]);
  });

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(follows(table, where)).toBe(true);

  const demo = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show",
  ];
  const tableEnd = text.indexOf(table.textContent ?? "") + (table.textContent ?? "").length;
  expectInOrder(text.slice(tableEnd), demo);
  expect(copyButtonNames(card)).toEqual([install, ...demo].map((c) => `Copy ${c}`));
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", { level: 2, name: "Start in two minutes" });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expect(follows(heading, lead)).toBe(true);

  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe("https://github.com/ffMathy/agentic-intermediate-language");
  expect(follows(example, repo)).toBe(true);

  const claude = screen.getByRole("region", { name: "In Claude Code" });
  const cli = screen.getByRole("region", { name: "In a terminal" });
  expect(follows(claude, example)).toBe(true);
  expect(follows(cli, example)).toBe(true);
  expect(claude.contains(example)).toBe(false);
  expect(cli.contains(example)).toBe(false);
});
