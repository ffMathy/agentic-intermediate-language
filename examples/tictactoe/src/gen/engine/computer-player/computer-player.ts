import { other, type Board, type Mark } from "../game-state";
import { evaluate } from "../rules";

const memo = new Map<string, number>();

function keyOf(board: Board, toMove: Mark, me: Mark): string {
  return board.map((cell) => cell ?? "_").join("") + toMove + me;
}

function shift(score: number): number {
  if (score > 0) {
    return score - 1;
  }
  if (score < 0) {
    return score + 1;
  }
  return 0;
}

function value(board: Board, toMove: Mark, me: Mark): number {
  const key = keyOf(board, toMove, me);
  const cached = memo.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const status = evaluate(board);
  let result: number;
  if (status.kind === "won") {
    result = status.mark === me ? 10 : -10;
  } else if (status.kind === "draw") {
    result = 0;
  } else {
    const maximizing = toMove === me;
    let best = maximizing ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) {
        continue;
      }
      const child = board.slice();
      child[i] = toMove;
      const score = shift(value(child, other(toMove), me));
      if (maximizing ? score > best : score < best) {
        best = score;
      }
    }
    result = best;
  }
  memo.set(key, result);
  return result;
}

/** choose(board: Board, me: Mark = "O") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */
export function choose(board: Board, me: Mark = "O"): number {
  let bestIndex = -1;
  let bestScore = -Infinity;
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) {
      continue;
    }
    const child = board.slice();
    child[i] = me;
    const score = shift(value(child, other(me), me));
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestIndex;
}
