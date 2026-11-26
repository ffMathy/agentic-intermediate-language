import type { CSSProperties } from "react";

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
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-3) var(--space-4)",
};

const baseButtonStyle: CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  maxWidth: "160px",
  height: "44px",
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  cursor: "pointer",
};

const sideButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  border: "1px solid var(--color-code-border)",
  background: "transparent",
  color: "var(--color-code-text)",
  fontWeight: 600,
};

const playButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  border: "1px solid var(--color-thread)",
  background: "var(--color-thread)",
  color: "var(--color-code)",
  fontWeight: 700,
};

const disabledStyle: CSSProperties = {
  opacity: 0.4,
  cursor: "default",
};

const playLabels: Record<WalkControlsProps["mode"], string> = {
  play: "Play",
  pause: "Pause",
  replay: "Replay",
};

/** three buttons on one row: Previous, the play button and Next, named "Previous chapter" and "Next chapter" */
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
        aria-label="Previous chapter"
        disabled={first}
        onClick={onPrevious}
        style={first ? { ...sideButtonStyle, ...disabledStyle } : sideButtonStyle}
      >
        Previous
      </button>
      <button
        type="button"
        id="walk-play"
        onClick={onPlay}
        style={playButtonStyle}
      >
        {playLabels[mode]}
      </button>
      <button
        type="button"
        aria-label="Next chapter"
        disabled={last}
        onClick={onNext}
        style={last ? { ...sideButtonStyle, ...disabledStyle } : sideButtonStyle}
      >
        Next
      </button>
    </div>
  );
}
