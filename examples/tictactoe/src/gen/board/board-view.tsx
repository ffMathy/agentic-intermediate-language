import type { Board, Status } from "../engine/game-state";
import { Text } from "../ui/text";

type BoardViewProps = {
  board: Board;
  status: Status;
  locked: boolean;
  onPlace: (index: number) => void;
};

/** shows 9 squares in 3 rows of 3; each square is empty, X or O */
export function BoardView({ board, status, locked, onPlace }: BoardViewProps) {
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
      {board.map((cell, index) => {
        const canPick = !locked && status.kind === "playing" && cell === null;
        const winning = status.kind === "won" && status.line.includes(index);
        const row = Math.floor(index / 3) + 1;
        const column = (index % 3) + 1;
        const content = cell === null ? "empty" : cell;
        return (
          <button
            key={index}
            type="button"
            disabled={!canPick}
            aria-label={`Row ${row}, column ${column}, ${content}`}
            onClick={() => {
              if (canPick) {
                onPlace(index);
              }
            }}
            style={{
              aspectRatio: "1",
              borderRadius: "var(--radius-md)",
              background: winning ? "var(--color-highlight)" : "var(--color-surface-raised)",
              border: "none",
              cursor: canPick ? "pointer" : "default",
            }}
          >
            {cell === null ? null : (
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
