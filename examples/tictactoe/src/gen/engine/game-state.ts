/** type Mark = "X" | "O" */
export type Mark = "X" | "O";

/** type Cell = Mark | null */
export type Cell = Mark | null;

/** type Board = Cell[] — always 9 cells, row by row: index = row × 3 + column */
export type Board = Cell[];

/** type Status = playing | won(mark, line) | draw */
export type Status = { kind: "playing" } | { kind: "won"; mark: Mark; line: number[] } | { kind: "draw" };

/** type Opponent = "friend" | "computer" */
export type Opponent = "friend" | "computer";

/** type Game = { board, next, status, opponent } */
export type Game = { board: Board; next: Mark; status: Status; opponent: Opponent };

/** type Action = place(index) | newGame | setOpponent(opponent) */
export type Action = { type: "place"; index: number } | { type: "newGame" } | { type: "setOpponent"; opponent: Opponent };

/** initial(opponent = "friend"): empty board, X to move, playing */
export function initial(opponent: Opponent = "friend"): Game {
  return { board: Array(9).fill(null), next: "X", status: { kind: "playing" }, opponent };
}

/** other(mark): the opposite mark */
export function other(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}

/** boardFrom(text): "X", "O" or "_" per cell, row by row; "/" and spaces are ignored */
export function boardFrom(text: string): Board {
  return [...text.replace(/[/\s]/g, "")].map((c) => (c === "X" || c === "O" ? c : null));
}
