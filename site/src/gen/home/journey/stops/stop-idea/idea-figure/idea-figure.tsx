/** a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses." over a simple person labelled "product owner", with "never loses." highlighted */
export function IdeaFigure() {
  return (
    <svg
      viewBox="0 0 320 210"
      role="img"
      aria-label="A product owner says: Tic-Tac-Toe. The computer never loses."
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "auto",
        display: "block",
      }}
    >
      <rect
        x={10}
        y={10}
        width={300}
        height={114}
        rx={16}
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
          strokeWidth: 2,
        }}
      />
      <path
        d="M48 121 L40 148 L74 121 Z"
        style={{ fill: "var(--color-surface)", stroke: "none" }}
      />
      <path
        d="M48 124 L40 148 L74 124"
        style={{
          fill: "none",
          stroke: "var(--color-border)",
          strokeWidth: 2,
        }}
      />
      <text
        x={160}
        y={40}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          fontWeight: 600,
          fill: "var(--color-text-muted)",
        }}
      >
        Tic-Tac-Toe.
      </text>
      <rect
        x={78}
        y={88}
        width={164}
        height={30}
        rx={4}
        style={{ fill: "var(--color-thread)" }}
      />
      <text
        x={160}
        y={74}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 24,
          fontWeight: 700,
          fill: "var(--color-text)",
        }}
      >
        The computer
      </text>
      <text
        x={160}
        y={111}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 24,
          fontWeight: 700,
          fill: "var(--color-text)",
        }}
      >
        never loses.
      </text>
      <circle
        cx={40}
        cy={166}
        r={10}
        style={{ fill: "var(--color-text-muted)" }}
      />
      <rect
        x={22}
        y={180}
        width={36}
        height={24}
        rx={12}
        style={{ fill: "var(--color-text-muted)" }}
      />
      <text
        x={70}
        y={190}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fill: "var(--color-text-muted)",
        }}
      >
        product owner
      </text>
    </svg>
  );
}
