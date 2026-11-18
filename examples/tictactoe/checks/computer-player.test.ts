// ail-derived-from: ComputerPlayer@0c990bfbddc62e20
import { expect, test } from "bun:test";
import { choose } from "../src/gen/computer-player";
import type { Board } from "../src/gen/game-state";
import { evaluate } from "../src/gen/rules";

test("never loses", () => {
  let games = 0;
  let xWins = 0;
  const explore = (board: Board, turn: "X" | "O") => {
    const status = evaluate(board);
    if (status.kind !== "playing") {
      games++;
      if (status.kind === "won" && status.mark === "X") xWins++;
      return;
    }
    if (turn === "X") {
      board.forEach((cell, i) => {
        if (cell !== null) return;
        const next = board.slice();
        next[i] = "X";
        explore(next, "O");
      });
    } else {
      const i = choose(board);
      expect(board[i]).toBeNull();
      const next = board.slice();
      next[i] = "O";
      explore(next, "X");
    }
  };
  explore(Array(9).fill(null), "X");
  expect(games).toBeGreaterThan(0);
  expect(xWins).toBe(0);
});
