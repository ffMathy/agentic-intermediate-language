// ail-derived-from: StopSystem@87615f613f7de33f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopSystem } from "../../../../../src/gen/home/journey/stops/stop-system/stop-system";

afterEach(() => {
  cleanup();
});

const lines = [
  "node Rules : fn   level: system",
  "  why   The one definition of a win and a draw.   <- Engine",
  "  what",
  "    LINES: list of list of integer = [[0,1,2], [3,4,5], [6,7,8], …]",
  "    evaluate(board: Board) -> Status",
  "      the first line in LINES order whose three cells hold the same mark → won(mark, line)",
  "      otherwise, if every cell is filled → draw",
  "      otherwise → playing",
  "    tie-break: when one move completes two lines, the winning line is the first in LINES order",
  "    examples",
  "      evaluate(boardFrom(\"XXX/OO_/___\")) => ({ kind: \"won\", mark: \"X\", line: [0, 1, 2] })",
  "      …",
  "      evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" })",
  "      LINES.length => 8",
  "  uses  GameState",
];

test("the system level", () => {
  render(<StopSystem />);

  const article = screen
    .getAllByRole("article")
    .find((el) => el.id === "stop-4");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "System level: one exact shape, one exact rule, examples that run.",
  });
  expect(heading).toBeDefined();

  const region = within(article).getByRole("region", {
    name: "System-level spec excerpt",
  });
  const text = region.textContent ?? "";
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const mark = "evaluate(board: Board) -> Status";
  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === mark,
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
