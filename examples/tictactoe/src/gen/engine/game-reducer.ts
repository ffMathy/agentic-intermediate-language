import { initial, other } from "./game-state";
import type { Action, Game, Opponent } from "./game-state";
import { evaluate } from "./rules";

/** reduce(game: Game, action: Action) -> Game — never mutates its input */
export function reduce(game: Game, action: Action): Game {
  switch (action.type) {
    case "place": {
      if (game.status.kind !== "playing" || game.board[action.index] !== null) {
        return game;
      }
      const board = game.board.map((cell, i) => (i === action.index ? game.next : cell));
      const status = evaluate(board);
      const next = status.kind === "playing" ? other(game.next) : game.next;
      return { ...game, board, status, next };
    }
    case "newGame":
      return initial(game.opponent);
    case "setOpponent":
      return initial(action.opponent);
  }
}

/** play(indices: number[], opponent: Opponent = "friend") -> Game — reduce place(i) for each index in order, starting from initial(opponent) */
export function play(indices: number[], opponent: Opponent = "friend"): Game {
  return indices.reduce<Game>(
    (game, index) => reduce(game, { type: "place", index }),
    initial(opponent),
  );
}
