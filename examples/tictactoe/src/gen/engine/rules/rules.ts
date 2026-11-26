import type { Board, Cell, Mark, Status } from "../game-state/game-state";

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

function isMark(cell: Cell): cell is Mark {
  return cell === "X" || cell === "O";
}

/** evaluate(board: Board) -> Status: the first line in LINES order whose three cells hold the same mark → won(mark, line); otherwise, if every cell is filled → draw; otherwise → playing */
export function evaluate(board: Board): Status {
  for (const line of LINES) {
    const [a, b, c] = line;
    const first = board[a];
    if (isMark(first) && first === board[b] && first === board[c]) {
      return { kind: "won", mark: first, line: [...line] };
    }
  }
  if (board.every((cell) => isMark(cell))) {
    return { kind: "draw" };
  }
  return { kind: "playing" };
}
