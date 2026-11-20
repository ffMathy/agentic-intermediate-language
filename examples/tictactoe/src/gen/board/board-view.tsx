import type { CSSProperties } from "react";
import type { Board, Cell, Status } from "../engine/game-state";
import { Text } from "../ui/text";

type BoardViewProps = {
  board: Board;
  status: Status;
  locked: boolean;
  onPlace: (index: number) => void;
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "var(--space-1)",
  background: "var(--color-surface)",
  width: "100%",
};

function squareContent(cell: Cell): string {
  return cell === undefined || cell === null ? "empty" : cell;
}

/** picking: pressing an empty square while the game is not over asks to place the current mark there */
export function BoardView({ board, status, locked, onPlace }: BoardViewProps) {
  const winningLine: number[] = status.kind === "won" ? status.line : [];
  const gameOver = status.kind !== "playing";
  return (
    <div role="grid" aria-label="Board" style={gridStyle}>
      {board.map((cell, index) => {
        const empty = cell === undefined || cell === null;
        const pickable = empty && !gameOver && !locked;
        const row = Math.floor(index / 3) + 1;
        const column = (index % 3) + 1;
        const style: CSSProperties = {
          aspectRatio: "1",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: winningLine.includes(index)
            ? "var(--color-highlight)"
            : "var(--color-surface-raised)",
          cursor: pickable ? "pointer" : "default",
        };
        return (
          <button
            key={index}
            type="button"
            aria-label={`Row ${row}, column ${column}, ${squareContent(cell)}`}
            disabled={!pickable}
            style={style}
            onClick={() => {
              if (pickable) {
                onPlace(index);
              }
            }}
          >
            {empty ? null : (
              <Text
                variant="mark"
                align="center"
                color={cell === "X" ? "color.player.x" : "color.player.o"}
              >
                {cell}
              </Text>
            )}
          </button>
        );
      })}
    </div>
  );
}
