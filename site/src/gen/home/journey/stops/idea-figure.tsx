/** a speech bubble saying "The computer never loses." over a simple person labelled "product owner", with "never loses." highlighted */
export function IdeaFigure() {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label="A product owner says: The computer never loses."
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "auto",
        display: "block",
      }}
    >
      <path
        d="M48 92 L40 118 L74 92"
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
          strokeWidth: 2,
        }}
      />
      <rect
        x={10}
        y={10}
        width={300}
        height={84}
        rx={16}
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
          strokeWidth: 2,
        }}
      />
      <rect
        x={78}
        y={58}
        width={164}
        height={30}
        rx={4}
        style={{ fill: "var(--color-thread)" }}
      />
      <text
        x={160}
        y={44}
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
        y={81}
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
        cy={136}
        r={10}
        style={{ fill: "var(--color-text-muted)" }}
      />
      <rect
        x={22}
        y={150}
        width={36}
        height={24}
        rx={12}
        style={{ fill: "var(--color-text-muted)" }}
      />
      <text
        x={70}
        y={160}
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
