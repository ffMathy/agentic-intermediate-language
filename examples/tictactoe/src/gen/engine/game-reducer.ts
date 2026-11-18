import { initial, other, type Action, type Game, type Opponent } from "./game-state";
import { evaluate } from "./rules";

/** reduce(game, action): place, newGame or setOpponent; never mutates its input */
export function reduce(game: Game, action: Action): Game {
  switch (action.type) {
    case "place": {
      if (game.status.kind !== "playing" || game.board[action.index] !== null) return game;
      const board = game.board.slice();
      board[action.index] = game.next;
      const status = evaluate(board);
      return { ...game, board, status, next: status.kind === "playing" ? other(game.next) : game.next };
    }
    case "newGame":
      return initial(game.opponent);
    case "setOpponent":
      return initial(action.opponent);
  }
}

/** play(indices, opponent = "friend"): reduce place(i) for each index in order, starting from initial(opponent) */
export function play(indices: number[], opponent: Opponent = "friend"): Game {
  return indices.reduce((game, index) => reduce(game, { type: "place", index }), initial(opponent));
}
