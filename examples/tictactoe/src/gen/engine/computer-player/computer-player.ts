import { other } from "../game-state/game-state";
import type { Board, Mark } from "../game-state/game-state";
import { evaluate } from "../rules/rules";

type Outcome = { score: number, index: number };

const memo = new Map<string, Outcome>();

function keyOf(board: Board, toMove: Mark): string {
  return board.map((cell) => cell ?? "_").join("") + toMove;
}

function best(board: Board, toMove: Mark): Outcome {
  const key = keyOf(board, toMove);
  const cached = memo.get(key);
  if (cached !== undefined) {
    return cached;
  }
  let result: Outcome = { score: -Infinity, index: -1 };
  for (let index = 0; index < board.length; index++) {
    const cell = board[index];
    if (cell === "X" || cell === "O") {
      continue;
    }
    const next = [...board];
    next[index] = toMove;
    const status = evaluate(next);
    let score: number;
    if (status.kind === "won") {
      score = status.mark === toMove ? 9 : -9;
    } else if (status.kind === "draw") {
      score = 0;
    } else {
      const child = best(next, other(toMove)).score;
      score = child > 0 ? 1 - child : child < 0 ? -child - 1 : 0;
    }
    if (score > result.score) {
      result = { score, index };
    }
  }
  memo.set(key, result);
  return result;
}

/** choose(board: Board, me: Mark = "O") -> number — full minimax, scored 10 − d / d − 10 / 0, lowest index on ties */
export function choose(board: Board, me: Mark = "O"): number {
  return best(board, me).index;
}
