// ail-derived-from: StopSpecialist@5a8dac0ba3dbeeca
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopSpecialist } from "../../../../src/gen/home/journey/stops/stop-specialist";

afterEach(() => {
  cleanup();
});

const lines: string[] = [
  "node ComputerPlayer : fn   level: specialist   @ai",
  "  why   Make \"the computer never loses\" true and provable, while still answering instantly.   <- Engine",
  "  what",
  "    choose(board: Board, me: Mark = \"O\") -> number    — precondition: the game on board is still playing",
  "    scoring, from me's point of view, where d counts the moves from board to the end of the game, this one included:",
  "      me wins → 10 − d;  me loses → d − 10;  draw → 0",
  "    tie-break: among equally scored moves, the lowest index",
  "    invariant: whatever the other player does, no game against choose ends in a win for the other player",
  "  how",
  "    decide full minimax over the remaining game tree, memoized by board",
  "      because there are at most 5,478 legal positions; exact search takes well under a millisecond and makes \"never loses\" provable",
  "      rejected hand-written heuristics (centre, corners, block, fork) because they are hard to prove correct and easy to get subtly wrong",
  "  verify",
  "    never loses: from the empty board, play every possible sequence of X moves against choose as O",
  "                 and assert that no game ends in a win for X",
];

const marks: string[] = [
  "never loses",
  "no game against choose ends in a win for the other player",
];

test("the specialist level", () => {
  render(<StopSpecialist />);

  const article = document.getElementById("stop-5");
  expect(article).not.toBeNull();
  if (article === null) {
    return;
  }
  const isArticle =
    article.tagName.toLowerCase() === "article" ||
    article.getAttribute("role") === "article";
  expect(isArticle).toBe(true);

  const scope = within(article);
  scope.getByRole("heading", {
    level: 3,
    name: "Specialist level: the promise becomes an algorithm and a proof.",
  });

  const region = scope.getByRole("region", {
    name: "Specialist-level spec excerpt",
  });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const elements = Array.from(region.querySelectorAll("*"));
  for (const mark of marks) {
    const highlighted = elements.some(
      (el) => (el.textContent ?? "") === mark,
    );
    expect(highlighted).toBe(true);
  }
});
