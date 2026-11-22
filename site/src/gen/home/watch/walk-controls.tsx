import type { CSSProperties } from "react";

/** props: mode: "play" | "pause" | "replay", first: boolean, last: boolean, onPrevious(), onPlay(), onNext() */
export type WalkControlsProps = {
  mode: "play" | "pause" | "replay";
  first: boolean;
  last: boolean;
  onPrevious: () => void;
  onPlay: () => void;
  onNext: () => void;
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-3) var(--space-4)",
};

const buttonStyle: CSSProperties = {
  height: "36px",
  padding: "0 var(--space-3)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-code-border)",
  background: "transparent",
  color: "var(--color-code-text)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontWeight: 600,
  cursor: "pointer",
};

const disabledStyle: CSSProperties = {
  opacity: 0.4,
  cursor: "default",
};

const playStyle: CSSProperties = {
  height: "36px",
  minWidth: "96px",
  padding: "0 var(--space-3)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-thread)",
  background: "var(--color-thread)",
  color: "var(--color-code)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontWeight: 700,
  cursor: "pointer",
};

const playLabels = {
  play: "Play",
  pause: "Pause",
  replay: "Replay",
};

/** three buttons in a row: "Previous chapter", the play button and "Next chapter" */
export function WalkControls({
  mode,
  first,
  last,
  onPrevious,
  onPlay,
  onNext,
}: WalkControlsProps) {
  return (
    <div style={rowStyle}>
      <button
        type="button"
        disabled={first}
        onClick={onPrevious}
        style={first ? { ...buttonStyle, ...disabledStyle } : buttonStyle}
      >
        Previous chapter
      </button>
      <button type="button" id="walk-play" onClick={onPlay} style={playStyle}>
        {playLabels[mode]}
      </button>
      <button
        type="button"
        disabled={last}
        onClick={onNext}
        style={last ? { ...buttonStyle, ...disabledStyle } : buttonStyle}
      >
        Next chapter
      </button>
    </div>
  );
}
