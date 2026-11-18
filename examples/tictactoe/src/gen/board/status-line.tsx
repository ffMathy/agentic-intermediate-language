import { Text } from "../catalog";
import type { Mark, Status } from "../engine/game-state";

function Player(props: { mark: Mark }) {
  return <span style={{ color: props.mark === "X" ? "var(--color-player-x)" : "var(--color-player-o)" }}>{props.mark}</span>;
}

/** StatusLine: exactly one message — whose turn it is, who won, or that it's a draw. */
export function StatusLine(props: { status: Status; next: Mark }) {
  return (
    <Text variant="status" align="center" live="polite">
      {props.status.kind === "draw" ? (
        "It's a draw"
      ) : props.status.kind === "won" ? (
        <>
          <Player mark={props.status.mark} /> wins!
        </>
      ) : (
        <>
          <Player mark={props.next} />
          's turn
        </>
      )}
    </Text>
  );
}
