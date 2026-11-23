import type { CSSProperties } from "react";
import type { Beat } from "./walkthrough/walkthrough";

export type WalkTimelineProps = {
  beats: Beat[];
  chapter: number;
  played: number;
  onPick: (chapter: number) => void;
};

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  gap: "var(--space-1)",
  alignItems: "flex-start",
};

const buttonStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
  width: "100%",
  minHeight: "44px",
  padding: "var(--space-1) 0",
  margin: 0,
  border: "none",
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
};

/** one button per chapter in a row, each as wide as its share of the walkthrough's time */
export function WalkTimeline({ beats, chapter, played, onPick }: WalkTimelineProps) {
  return (
    <ol aria-label="Chapters" style={listStyle}>
      {beats.map((beat, index) => {
        const current = index === chapter;
        const fillWidth =
          index < chapter ? "100%" : current ? `${played * 100}%` : "0%";
        const barStyle: CSSProperties = {
          display: "block",
          height: "8px",
          boxSizing: "border-box",
          borderRadius: "var(--radius-pill)",
          overflow: "hidden",
          background: beat.branch ? "transparent" : "var(--color-code-pick)",
          border: beat.branch
            ? "1.5px dashed var(--color-code-muted)"
            : "1px solid var(--color-code-muted)",
        };
        const fillStyle: CSSProperties = {
          display: "block",
          height: "100%",
          borderRadius: "var(--radius-pill)",
          background: "var(--color-thread)",
          width: fillWidth,
        };
        const titleStyle: CSSProperties = {
          display: "block",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-tiny)",
          lineHeight: 1.3,
          color: current ? "var(--color-code-text)" : "var(--color-code-muted)",
          overflowWrap: "anywhere",
          ...(current ? { fontWeight: 700 } : {}),
        };
        return (
          <li
            key={beat.id}
            style={{
              flexGrow: beat.seconds,
              flexShrink: 1,
              flexBasis: 0,
              minWidth: 0,
            }}
          >
            <button
              type="button"
              aria-label={`Chapter ${index + 1}: ${beat.title}`}
              aria-current={current ? "step" : undefined}
              onClick={() => onPick(index)}
              style={buttonStyle}
            >
              <span style={barStyle}>
                <span style={fillStyle} />
              </span>
              <span className="ail-wide" style={titleStyle}>
                {beat.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
