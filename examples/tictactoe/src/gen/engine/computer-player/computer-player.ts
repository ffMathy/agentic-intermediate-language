import { other, type Board, type Mark } from "../game-state";
import { evaluate } from "../rules";

const memo = new Map<string, { score: number; index: number }>();

function search(board: Board, me: Mark, turn: Mark, d: number): { score: number; index: number } {
  const key = `${board.map((cell) => cell ?? "_").join("")}|${me}|${turn}|${d}`;
  const cached = memo.get(key);
  if (cached) return cached;
  let best = { score: turn === me ? -Infinity : Infinity, index: -1 };
  for (let index = 0; index < 9; index++) {
    if (board[index] !== null) continue;
    const next = board.slice();
    next[index] = turn;
    const status = evaluate(next);
    const score =
      status.kind === "won"
        ? status.mark === me
          ? 10 - (d + 1)
          : d + 1 - 10
        : status.kind === "draw"
          ? 0
          : search(next, me, other(turn), d + 1).score;
    if (turn === me ? score > best.score : score < best.score) best = { score, index };
  }
  memo.set(key, best);
  return best;
}

/** choose(board, me = "O"): the minimax-best index, scoring wins 10 − d and losses d − 10, lowest index on ties */
export function choose(board: Board, me: Mark = "O"): number {
  return search(board, me, me, 0).index;
}
