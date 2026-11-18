import { Text } from "../catalog";
import type { Board, Status } from "../engine/game-state";

/** BoardView: 9 squares in 3 rows of 3; pressing a square that can be picked asks to place the current mark there. */
export function BoardView(props: { board: Board; status: Status; locked: boolean; onPlace: (index: number) => void }) {
  const winning = props.status.kind === "won" ? props.status.line : [];
  return (
    <div
      role="grid"
      aria-label="Board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--space-1)",
        background: "var(--color-surface)",
        width: "100%",
      }}
    >
      {[0, 1, 2].map((row) => (
        <div key={row} role="row" style={{ display: "contents" }}>
          {[0, 1, 2].map((column) => {
            const index = row * 3 + column;
            const cell = props.board[index] ?? null;
            const pickable = cell === null && props.status.kind === "playing" && !props.locked;
            return (
              <div key={index} role="gridcell" style={{ display: "contents" }}>
                <button
                  type="button"
                  aria-label={`Row ${row + 1}, column ${column + 1}, ${cell ?? "empty"}`}
                  disabled={!pickable}
                  onClick={() => props.onPlace(index)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "var(--radius-md)",
                    background: winning.includes(index) ? "var(--color-highlight)" : "var(--color-surface-raised)",
                    border: "none",
                    cursor: pickable ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cell && (
                    <Text variant="mark" align="center" color={cell === "X" ? "color.player.x" : "color.player.o"}>
                      {cell}
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
