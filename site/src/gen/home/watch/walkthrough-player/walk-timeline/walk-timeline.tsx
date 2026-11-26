import type { Beat } from "../walkthrough/walkthrough";

type WalkTimelineProps = {
  beats: Beat[];
  chapter: number;
  played: number;
  onPick: (chapter: number) => void;
};

/** one button per chapter in a row, each as wide as its share of the walkthrough's time */
export function WalkTimeline({ beats, chapter, played, onPick }: WalkTimelineProps) {
  return (
    <ol
      aria-label="Chapters"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        gap: "var(--space-1)",
        alignItems: "flex-start",
      }}
    >
      {beats.map((beat, index) => {
        const isCurrent = index === chapter;
        const fillWidth =
          index < chapter ? "100%" : isCurrent ? `${played * 100}%` : "0%";
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
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onPick(index)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "var(--space-1)",
                width: "100%",
                minHeight: "44px",
                padding: "var(--space-1) 0",
                margin: 0,
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "8px",
                  boxSizing: "border-box",
                  borderRadius: "var(--radius-pill)",
                  overflow: "hidden",
                  background: beat.branch
                    ? "transparent"
                    : "var(--color-code-pick)",
                  border: beat.branch
                    ? "1.5px dashed var(--color-code-muted)"
                    : "1px solid var(--color-code-muted)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--color-thread)",
                    width: fillWidth,
                  }}
                />
              </span>
              <span
                className="ail-wide"
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--font-tiny)",
                  lineHeight: 1.3,
                  color: isCurrent
                    ? "var(--color-code-text)"
                    : "var(--color-code-muted)",
                  fontWeight: isCurrent ? 700 : undefined,
                  overflowWrap: "anywhere",
                }}
              >
                {beat.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
