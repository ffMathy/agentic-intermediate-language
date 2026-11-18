import type { Board, Status } from "./game-state";

/** LINES: rows top to bottom, then columns left to right, then the two diagonals */
export const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** evaluate(board): the first line in LINES order holding three equal marks wins; otherwise a full board is a draw; otherwise playing */
export function evaluate(board: Board): Status {
  for (const [a, b, c] of LINES as [number, number, number][]) {
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) return { kind: "won", mark, line: [a, b, c] };
  }
  return board.every((cell) => cell !== null) ? { kind: "draw" } : { kind: "playing" };
}
