// ail-derived-from: GetStarted@5cc5780b3cef4ac2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function follows(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
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
  const first = "/plugin marketplace add ffMathy/agentic-intermediate-language";
  const second = "/plugin install ail@agentic-intermediate-language";
  const firstButton = within(card).getByRole("button", { name: `Copy ${first}` });
  const secondButton = within(card).getByRole("button", { name: `Copy ${second}` });
  expect(follows(firstButton, secondButton)).toBe(true);
  const text = card.textContent ?? "";
  expect(text).toContain(first);
  expect(text).toContain(second);
  expect(text.indexOf(first)).toBeLessThan(text.indexOf(second));
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  const install = "bun add -g github:ffMathy/agentic-intermediate-language";
  within(card).getByRole("button", { name: `Copy ${install}` });
  expect(card.textContent ?? "").toContain(install);

  const table = within(card).getByRole("table");
  const rows = within(table).getAllByRole("row");
  const expected: [string, string][] = [
    [
      "ail build",
      "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
    ],
    ["ail show [what]", "The tree, a node, one reader's view, or what changed."],
    [
      "ail adopt",
      "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same.",
    ],
  ];
  const bodyRows = rows.filter((row) =>
    expected.some(([cmd]) => (row.querySelector("td, th")?.textContent ?? "").trim() === cmd),
  );
  expect(bodyRows.length).toBe(3);
  bodyRows.forEach((row, i) => {
    const cells = within(row).getAllByRole("cell");
    const allCells = row.querySelectorAll("td, th");
    expect((allCells[0]?.textContent ?? "").trim()).toBe(expected[i][0]);
    expect(cells.length + row.querySelectorAll("th").length).toBeGreaterThanOrEqual(2);
    expect((allCells[1]?.textContent ?? "").trim()).toBe(expected[i][1]);
  });

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expect(follows(table, where)).toBe(true);

  const demo = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language",
    "bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show stakeholder",
  ];
  const buttons = demo.map((cmd) => within(card).getByRole("button", { name: `Copy ${cmd}` }));
  for (let i = 1; i < buttons.length; i++) {
    expect(follows(buttons[i - 1], buttons[i])).toBe(true);
  }
  const names = copyButtonNames(card);
  const demoNames = names.filter((n) => demo.some((cmd) => n === `Copy ${cmd}`));
  expect(demoNames).toEqual(demo.map((cmd) => `Copy ${cmd}`));
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
