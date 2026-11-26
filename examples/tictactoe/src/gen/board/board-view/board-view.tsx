import type { CSSProperties } from "react";
import type { Board, Mark, Status } from "../../engine/game-state/game-state";
import { Text } from "../../ui/text/text";

export type BoardViewProps = {
  board: Board;
  status: Status;
  locked: boolean;
  onPlace: (index: number) => void;
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "var(--space-1)",
  background: "var(--color-surface)",
  width: "100%",
};

const rowStyle: CSSProperties = {
  display: "contents",
};

const ROWS = [0, 1, 2];
const COLUMNS = [0, 1, 2];

/** shows 9 squares in 3 rows of 3; each square is empty, X or O */
export function BoardView({ board, status, locked, onPlace }: BoardViewProps) {
  const winning: readonly number[] = status.kind === "won" ? status.line : [];
  return (
    <div role="grid" aria-label="Board" style={gridStyle}>
      {ROWS.map((row) => (
        <div key={row} role="row" style={rowStyle}>
          {COLUMNS.map((column) => {
            const index = row * 3 + column;
            const cell = board[index];
            const mark: Mark | undefined =
              cell === "X" || cell === "O" ? cell : undefined;
            const pickable =
              mark === undefined && status.kind === "playing" && !locked;
            const content = mark === undefined ? "empty" : mark;
            const squareStyle: CSSProperties = {
              width: "100%",
              aspectRatio: "1",
              borderRadius: "var(--radius-md)",
              background: winning.includes(index)
                ? "var(--color-highlight)"
                : "var(--color-surface-raised)",
              border: "none",
              cursor: pickable ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            };
            return (
              <div key={column} role="gridcell">
                <button
                  type="button"
                  aria-label={`Row ${row + 1}, column ${column + 1}, ${content}`}
                  disabled={!pickable}
                  style={squareStyle}
                  onClick={() => {
                    if (pickable) {
                      onPlace(index);
                    }
                  }}
                >
                  {mark === undefined ? null : (
                    <Text
                      variant="mark"
                      color={mark === "X" ? "color.player.x" : "color.player.o"}
                      align="center"
                    >
                      {mark}
                    </Text>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
