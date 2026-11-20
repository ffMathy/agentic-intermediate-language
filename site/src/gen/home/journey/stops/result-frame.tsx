import { Stack } from "../../../parts/stack";

const trace = [
  { key: "1", seen: "“X's turn”", source: "StatusLine copy" },
  { key: "2", seen: "the O after 300 ms", source: "PlayAGame decision" },
  { key: "3", seen: "the square the O picks", source: "ComputerPlayer" },
];

/** "a hint to pick the computer, the live game in a dark frame, a link to open it on its own, and three lines that trace what is on screen back to the spec" */
export function ResultFrame() {
  return (
    <Stack dir="v" gap="space.3" align="center" style={{ width: "100%" }}>
      <p
        style={{
          background: "var(--color-thread)",
          color: "var(--color-text)",
          fontSize: "var(--font-small)",
          fontWeight: 600,
          borderRadius: "var(--radius-pill)",
          padding: "var(--space-1) var(--space-3)",
          margin: 0,
        }}
      >
        Pick “Computer”, then play as X
      </p>
      <div
        style={{
          background: "var(--color-code)",
          padding: "clamp(4px, 2vw, 12px)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: "400px",
          boxSizing: "border-box",
        }}
      >
        <iframe
          src="./demo/"
          title="Tic-Tac-Toe, built from its AIL spec"
          loading="lazy"
          style={{
            width: "100%",
            height: "60vw",
            minHeight: "520px",
            maxHeight: "600px",
            border: 0,
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            display: "block",
          }}
        />
      </div>
      <a
        href="./demo/"
        style={{
          fontSize: "var(--font-small)",
          fontWeight: 600,
          color: "var(--color-accent)",
        }}
      >
        Open the game full screen ↗
      </a>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
          alignItems: "stretch",
        }}
      >
        {trace.map((item) => (
          <li
            key={item.key}
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text)",
            }}
          >
            {item.seen}
            {" ← "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
              }}
            >
              {item.source}
            </span>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
