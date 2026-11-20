import type { Board, Status } from "./game-state";

/** LINES: list of list of integer — rows top to bottom, then columns left to right, then the two diagonals */
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

/** evaluate(board: Board) -> Status — the first line in LINES order whose three cells hold the same mark → won(mark, line); otherwise, if every cell is filled → draw; otherwise → playing */
export function evaluate(board: Board): Status {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if ((mark === "X" || mark === "O") && board[b] === mark && board[c] === mark) {
      return { kind: "won", mark, line: [...line] };
    }
  }
  if (board.every((cell) => cell === "X" || cell === "O")) {
    return { kind: "draw" };
  }
  return { kind: "playing" };
}
