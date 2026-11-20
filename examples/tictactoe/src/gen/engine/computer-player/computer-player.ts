import { other } from "../game-state";
import type { Board, Cell, Mark } from "../game-state";
import { evaluate } from "../rules";

const memo = new Map<string, number>();

function isEmpty(cell: Cell): boolean {
  return cell !== "X" && cell !== "O";
}

function keyOf(board: Board, me: Mark, mover: Mark): string {
  return board.map((cell) => (isEmpty(cell) ? "_" : cell)).join("") + me + mover;
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

function place(board: Board, index: number, mark: Mark): Board {
  const next: Cell[] = [...board];
  next[index] = mark;
  return next;
}

function value(board: Board, me: Mark, mover: Mark): number {
  const status = evaluate(board);
  if (status.kind === "won") {
    return status.mark === me ? 10 : -10;
  }
  if (status.kind === "draw") {
    return 0;
  }
  const key = keyOf(board, me, mover);
  const cached = memo.get(key);
  if (cached !== undefined) {
    return cached;
  }
  let best = mover === me ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!isEmpty(board[i])) {
      continue;
    }
    const score = shift(value(place(board, i, mover), me, other(mover)));
    if (mover === me ? score > best : score < best) {
      best = score;
    }
  }
  memo.set(key, best);
  return best;
}

/** choose(board: Board, me: Mark = "O") -> number — full minimax, scored 10 − d / d − 10 / 0 from me's point of view, lowest index on ties */
export function choose(board: Board, me: Mark = "O"): number {
  let bestIndex = -1;
  let bestScore = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (!isEmpty(board[i])) {
      continue;
    }
    const score = shift(value(place(board, i, me), me, other(me)));
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestIndex;
}
