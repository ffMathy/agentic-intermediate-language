import type { Mark, Status } from "../engine/game-state";
import { Text } from "../ui/text";

/** shows exactly one message: whose turn it is, who won, or that it's a draw */
export function StatusLine({ status, next }: { status: Status; next: Mark }) {
  if (status.kind === "draw") {
    return (
      <Text variant="status" align="center" live="polite">
        It's a draw
      </Text>
    );
  }
  const player = status.kind === "won" ? status.mark : next;
  const playerPart = (
    <span
      style={{
        color: player === "X" ? "var(--color-player-x)" : "var(--color-player-o)",
      }}
    >
      {player}
    </span>
  );
  return (
    <Text variant="status" align="center" live="polite">
      {playerPart}
      {status.kind === "won" ? " wins!" : "'s turn"}
    </Text>
  );
}
