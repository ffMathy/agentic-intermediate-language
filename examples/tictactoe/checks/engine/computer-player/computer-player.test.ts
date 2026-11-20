// ail-derived-from: ComputerPlayer@882d0c5467192c53
import { expect, test } from "bun:test";
import { choose } from "../../../src/gen/engine/computer-player/computer-player";
import { boardFrom } from "../../../src/gen/engine/game-state";
import type { Board, Mark } from "../../../src/gen/engine/game-state";
import { evaluate } from "../../../src/gen/engine/rules";

function isEmpty(board: Board, index: number): boolean {
  const cell = board[index];
  return cell !== "X" && cell !== "O";
}

function place(board: Board, index: number, mark: Mark): Board {
  return board.map((cell, i) => (i === index ? mark : cell));
}

test("never loses", () => {
  let gamesPlayed = 0;
  let xWins = 0;
  let illegalMoves = 0;

  const play = (board: Board, next: Mark): void => {
    const status = evaluate(board);
    if (status.kind === "won") {
      gamesPlayed += 1;
      if (status.mark === "X") {
        xWins += 1;
      }
      return;
    }
    if (status.kind === "draw") {
      gamesPlayed += 1;
      return;
    }
    if (next === "X") {
      for (let index = 0; index < 9; index += 1) {
        if (isEmpty(board, index)) {
          play(place(board, index, "X"), "O");
        }
      }
      return;
    }
    const index = choose(board, "O");
    if (!Number.isInteger(index) || index < 0 || index > 8 || !isEmpty(board, index)) {
      illegalMoves += 1;
      return;
    }
    play(place(board, index, "O"), "X");
  };

  play(boardFrom("___/___/___"), "X");

  expect(illegalMoves).toBe(0);
  expect(gamesPlayed).toBeGreaterThan(0);
  expect(xWins).toBe(0);
});
