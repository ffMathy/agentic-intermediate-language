import type { CSSProperties } from "react";

const diffLines: string[] = [
  "@@ node WatchADemo : flow   level: experience",
  "     the board can't be picked during the demo",
  "+    \"Watch again\" appears once the demo has ended",
  "@@ Scenario: perfect play ends in a draw",
  "       Then the status says \"It's a draw\"",
  "+      And \"Watch again\" is shown",
  "+    Scenario: watch again",
  "+      Given the demo has ended",
  "+      When the viewer presses \"Watch again\"",
  "+      Then the board is empty, the status says \"X's turn\", and \"Watch again\" is gone",
  "@@ look",
  "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]",
  "+    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView, again ]",
  "+    again    Button.secondary, only once the demo has ended",
  "+  copy",
  "+    demo.again  \"Watch again\"",
];

const fileStyle: CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  background: "var(--color-surface)",
  minWidth: 0,
};

const filebarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-2) var(--space-3)",
  background: "var(--color-surface-raised)",
  borderBottom: "1px solid var(--color-border)",
};

const pathStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-text)",
  overflowWrap: "anywhere",
  flex: "1 1 200px",
};

const tagStyle: CSSProperties = {
  padding: "2px var(--space-2)",
  borderRadius: "var(--radius-pill)",
  fontSize: "var(--font-micro)",
  fontWeight: 700,
  letterSpacing: "0.04em",
  background: "var(--color-level-product)",
  color: "var(--color-on-accent)",
};

const diffStyle: CSSProperties = {
  margin: 0,
  overflowX: "auto",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  lineHeight: 1.7,
  color: "var(--color-text)",
};

const lineStyle: CSSProperties = {
  whiteSpace: "pre",
  padding: "0 var(--space-3)",
  minWidth: "max-content",
};

const addedStyle: CSSProperties = {
  ...lineStyle,
  background: "rgba(21, 128, 61, 0.12)",
};

const removedStyle: CSSProperties = {
  ...lineStyle,
  background: "rgba(220, 38, 38, 0.10)",
};

const hunkStyle: CSSProperties = {
  ...lineStyle,
  background: "var(--color-accent-soft)",
  color: "var(--color-text-muted)",
};

const addedMarkStyle: CSSProperties = {
  color: "var(--color-pass)",
  fontWeight: 700,
};

const removedMarkStyle: CSSProperties = {
  color: "var(--color-player-o)",
  fontWeight: 700,
};

function DiffLine({ line }: { line: string }) {
  const first = line.charAt(0);
  if (first === "@") {
    return <div style={hunkStyle}>{line}</div>;
  }
  if (first === "+") {
    return (
      <div style={addedStyle}>
        <span style={addedMarkStyle}>{first}</span>
        {line.slice(1)}
      </div>
    );
  }
  if (first === "-") {
    return (
      <div style={removedStyle}>
        <span style={removedMarkStyle}>{first}</span>
        {line.slice(1)}
      </div>
    );
  }
  return <div style={lineStyle}>{line}</div>;
}

/** "the demo's spec file, with the lines the change added, removed and kept around them, each kind marked" */
export function PullRequestDiff() {
  return (
    <div style={fileStyle}>
      <div style={filebarStyle}>
        <span style={pathStyle}>examples/tictactoe/ail/app/demo/demo.ail.md</span>
        <span style={tagStyle}>spec</span>
      </div>
      <pre style={diffStyle}>
        {diffLines.map((line, index) => (
          <DiffLine key={index} line={line} />
        ))}
      </pre>
    </div>
  );
}
