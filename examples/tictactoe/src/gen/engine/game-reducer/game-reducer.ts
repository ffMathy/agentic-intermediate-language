import { initial, other } from "../game-state/game-state";
import type { Action, Board, Game, Opponent } from "../game-state/game-state";
import { evaluate } from "../rules/rules";

/** reduce(game: Game, action: Action) -> Game — never mutates its input */
export function reduce(game: Game, action: Action): Game {
  switch (action.type) {
    case "place": {
      if (game.status.kind !== "playing" || game.board[action.index] != null) {
        return game;
      }
      const board: Board = game.board.slice();
      board[action.index] = game.next;
      const status = evaluate(board);
      const next = status.kind === "playing" ? other(game.next) : game.next;
      return { ...game, board, next, status };
    }
    case "newGame":
      return initial(game.opponent);
    case "setOpponent":
      return initial(action.opponent);
  }
}

/** play(indices: list of integer, opponent: Opponent = "friend") -> Game — reduce place(i) for each index in order, starting from initial(opponent) */
export function play(indices: number[], opponent: Opponent = "friend"): Game {
  return indices.reduce<Game>(
    (game, index) => reduce(game, { type: "place", index }),
    initial(opponent),
  );
}
