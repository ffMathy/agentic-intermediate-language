// ail-derived-from: StopSpecialist@9b2a9712dde29b1d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopSpecialist } from "../../../../src/gen/home/journey/stops/stop-specialist";

afterEach(() => {
  cleanup();
});

const lines = [
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

test("the specialist level", () => {
  render(<StopSpecialist />);

  const article = screen.getAllByRole("article").find((a) => a.id === "stop-5");
  expect(article).toBeDefined();
  const stop = article as HTMLElement;

  const heading = within(stop).getByRole("heading", {
    level: 3,
    name: "Specialist level: the promise becomes an algorithm and a proof.",
  });
  expect(heading).toBeTruthy();

  const region = within(stop).getByRole("region", {
    name: "Specialist-level spec excerpt",
  });
  const text = region.textContent ?? "";
  expect(lines.length).toBe(15);
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const marked = Array.from(region.querySelectorAll("mark")).map(
    (m) => m.textContent ?? "",
  );
  expect(marked).toContain("never loses");
  expect(marked).toContain(
    "no game against choose ends in a win for the other player",
  );
});
