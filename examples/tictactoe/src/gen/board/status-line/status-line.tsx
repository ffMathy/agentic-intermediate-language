import type { Mark, Status } from "../../engine/game-state/game-state";
import { Text } from "../../ui/text/text";

const playerColor: Record<Mark, string> = {
  X: "var(--color-player-x)",
  O: "var(--color-player-o)",
};

/** shows exactly one message: whose turn it is, who won, or that it's a draw */
export function StatusLine({ status, next }: { status: Status; next: Mark }) {
  if (status.kind === "draw") {
    return (
      <Text variant="status" align="center" live="polite">
        It's a draw
      </Text>
    );
  }
  const player: Mark = status.kind === "won" ? status.mark : next;
  return (
    <Text variant="status" align="center" live="polite">
      <span style={{ color: playerColor[player] }}>{player}</span>
      {status.kind === "won" ? " wins!" : "'s turn"}
    </Text>
  );
}
