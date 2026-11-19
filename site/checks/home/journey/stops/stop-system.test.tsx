// ail-derived-from: StopSystem@8dc84e0679abb3b3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopSystem } from "../../../../src/gen/home/journey/stops/stop-system";

afterEach(() => {
  cleanup();
});

const lines: string[] = [
  "node Engine : library   level: system",
  "  why   One set of rules for every part of the game, so playing and watching can never disagree.   <- TicTacToe",
  "  children  GameState, Rules, GameReducer, ComputerPlayer",
  "…",
  "node Rules : fn   level: system",
  "  …",
  "    evaluate(board: Board) -> Status",
  "      the first line in LINES order whose three cells hold the same mark → won(mark, line)",
  "      otherwise, if every cell is filled → draw",
  "      otherwise → playing",
  "    …",
  "    examples",
  "      evaluate(boardFrom(\"XXX/OO_/___\")) => ({ kind: \"won\", mark: \"X\", line: [0, 1, 2] })",
  "      …",
  "      evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" })",
];

test("the system level", () => {
  render(<StopSystem />);

  const article = screen
    .getAllByRole("article")
    .find((el) => el.id === "stop-4");
  expect(article).toBeDefined();
  if (!article) return;

  expect(
    within(article).getByRole("heading", {
      level: 3,
      name: "System level: one exact shape, one exact rule, examples that run.",
    }),
  ).toBeTruthy();

  const region = screen.getByRole("region", { name: "System-level spec excerpt" });
  const text = region.textContent ?? "";

  let position = 0;
  for (const line of lines) {
    const needle = line.trim();
    const found = text.indexOf(needle, position);
    expect(found).toBeGreaterThanOrEqual(0);
    position = found + needle.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === "ComputerPlayer",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
