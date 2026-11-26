/** type Mark = "X" | "O" */
export type Mark = "X" | "O";

/** type Cell = Mark | nothing */
export type Cell = Mark | null;

/** type Board = list of Cell — always 9 cells, row by row: index = row × 3 + column */
export type Board = Cell[];

/** type Status = { kind: "playing" } | { kind: "won", mark: Mark, line: list of integer } | { kind: "draw" } */
export type Status =
  | { kind: "playing" }
  | { kind: "won"; mark: Mark; line: number[] }
  | { kind: "draw" };

/** type Opponent = "friend" | "computer" */
export type Opponent = "friend" | "computer";

/** type Game = { board: Board, next: Mark, status: Status, opponent: Opponent } */
export type Game = {
  board: Board;
  next: Mark;
  status: Status;
  opponent: Opponent;
};

/** type Action = { type: "place", index: integer } | { type: "newGame" } | { type: "setOpponent", opponent: Opponent } */
export type Action =
  | { type: "place"; index: number }
  | { type: "newGame" }
  | { type: "setOpponent"; opponent: Opponent };

/** initial(opponent: Opponent = "friend") -> Game — empty board, X to move, playing */
export function initial(opponent: Opponent = "friend"): Game {
  return {
    board: Array.from({ length: 9 }, (): Cell => null),
    next: "X",
    status: { kind: "playing" },
    opponent,
  };
}

/** other(mark: Mark) -> Mark — the opposite mark */
export function other(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}

/** boardFrom(text: text) -> Board — "X", "O" or "_" per cell, row by row; "/" and spaces are ignored */
export function boardFrom(text: string): Board {
  return text
    .split("")
    .filter((c) => c !== "/" && c !== " ")
    .map((c): Cell => (c === "X" ? "X" : c === "O" ? "O" : null));
}
