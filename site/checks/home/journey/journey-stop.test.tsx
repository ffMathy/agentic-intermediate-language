// ail-derived-from: JourneyStop@40ebf0913e99cfc7
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

const baseProps = {
  number: 4,
  color: "level.system",
  depth: "Depth four",
  chip: "SYSTEM",
  reader: "engineers",
  headline: "System level",
  explanation: "An explanation of the system level.",
  lines: ["node Game : flow", "  what", "    The computer never loses."],
  label: "Spec excerpt",
  file: "examples/tictactoe/tictactoe.ail.md",
  highlight: ["never loses"],
  turnsInto: "Tests.",
  figure: <div>figure drawing</div>,
};

function hasElementWithText(root: HTMLElement, text: string): boolean {
  const all = [root, ...Array.from(root.querySelectorAll("*"))];
  return all.some((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim() === text);
}

test("a stop", () => {
  render(<JourneyStop {...baseProps} />);
  const article = screen.getByRole("article");
  expect(article.getAttribute("id")).toBe("stop-4");
  const scope = within(article);
  expect(hasElementWithText(article, "4")).toBe(true);
  expect(scope.getAllByText("SYSTEM").length).toBeGreaterThan(0);
  expect(hasElementWithText(article, "Who reads this: engineers")).toBe(true);
  scope.getByRole("heading", { level: 3, name: "System level" });
  scope.getByRole("region", { name: "Spec excerpt" });
  expect(hasElementWithText(article, "Turns into: Tests.")).toBe(true);
});

test("a stop with a file to browse", () => {
  render(<JourneyStop {...baseProps} browse="#spec/tictactoe/ail-file.ail.md" />);
  const link = screen.getByRole("link", { name: "Open the whole file in the spec browser ↓" });
  expect(link.getAttribute("href")).toBe("#spec/tictactoe/ail-file.ail.md");
});
