import type { CSSProperties } from "react";
import { Stack } from "../../../parts/stack";

const hintStyle: CSSProperties = {
  background: "var(--color-thread)",
  color: "var(--color-text)",
  fontSize: "var(--font-small)",
  fontWeight: 600,
  borderRadius: "var(--radius-pill)",
  padding: "var(--space-1) var(--space-3)",
  margin: 0,
};

const deviceStyle = (pad: string): CSSProperties => ({
  background: "var(--color-code)",
  padding: pad,
  borderRadius: "var(--radius-xl)",
  width: "100%",
  maxWidth: "400px",
  boxSizing: "border-box",
});

const frameStyle = (height: string): CSSProperties => ({
  width: "100%",
  height,
  border: 0,
  borderRadius: "var(--radius-lg)",
  background: "var(--color-surface)",
  display: "block",
});

const openStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  color: "var(--color-accent)",
};

const traceStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  width: "100%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
  alignItems: "stretch",
};

const itemStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  color: "var(--color-text)",
};

const sourceStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  color: "var(--color-text-muted)",
};

const trace: [string, string][] = [
  ["“X's turn”", "StatusLine copy"],
  ["the O after 300 ms", "PlayAGame decision"],
  ["the square the O picks", "ComputerPlayer"],
];

/** "a hint to pick the computer, the live game in a dark frame, a link to open it on its own, and three lines that trace what is on screen back to the spec" */
export function ResultFrame() {
  return (
    <Stack dir="v" gap="space.3" align="center" style={{ width: "100%" }}>
      <p style={hintStyle}>Pick “Computer”, then play as X</p>
      <div className="ail-wide" style={deviceStyle("var(--space-3)")}>
        <iframe
          src="./demo/"
          title="Tic-Tac-Toe, built from its AIL spec"
          loading="lazy"
          style={frameStyle("600px")}
        />
      </div>
      <div className="ail-narrow" style={deviceStyle("var(--space-1)")}>
        <iframe
          src="./demo/"
          title="Tic-Tac-Toe, built from its AIL spec"
          loading="lazy"
          style={frameStyle("520px")}
        />
      </div>
      <a href="./demo/" style={openStyle}>
        Open the game full screen ↗
      </a>
      <ul style={traceStyle}>
        {trace.map(([seen, source]) => (
          <li key={source} style={itemStyle}>
            {seen}
            {" ← "}
            <span style={sourceStyle}>{source}</span>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
