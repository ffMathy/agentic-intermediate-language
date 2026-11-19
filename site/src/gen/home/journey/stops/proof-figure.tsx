const chips = [
  { y: 10, color: "var(--color-level-product)", label: "promise · product" },
  { y: 66, color: "var(--color-level-experience)", label: "scenario · experience" },
  { y: 122, color: "var(--color-level-system)", label: "rules · system" },
  { y: 178, color: "var(--color-level-specialist)", label: "invariant · specialist" },
  { y: 234, color: "var(--color-level-build)", label: "test · never loses" },
];

const threadStroke = {
  stroke: "var(--color-thread-strong)",
  strokeWidth: 4,
  strokeLinecap: "round" as const,
};

/** five stacked chips, one per level the promise passed through, joined by the yellow thread, ending in a green check */
export function ProofFigure() {
  return (
    <svg
      viewBox="0 0 300 280"
      role="img"
      aria-label="The thread runs from the promise through the scenario, the rules and the invariant to a passing test"
      style={{
        width: "100%",
        maxWidth: "300px",
        height: "auto",
        display: "block",
      }}
    >
      <line x1={30} y1={27} x2={30} y2={251} style={threadStroke} />
      {chips.map((chip) => (
        <line
          key={`branch-${chip.y}`}
          x1={30}
          y1={chip.y + 17}
          x2={50}
          y2={chip.y + 17}
          style={threadStroke}
        />
      ))}
      {chips.map((chip) => (
        <rect
          key={`chip-${chip.y}`}
          x={50}
          y={chip.y}
          width={200}
          height={34}
          rx={17}
          style={{ fill: chip.color }}
        />
      ))}
      {chips.map((chip) => (
        <text
          key={`label-${chip.y}`}
          x={150}
          y={chip.y + 22}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 700,
            fill: "var(--color-on-accent)",
          }}
        >
          {chip.label}
        </text>
      ))}
      <line
        x1={250}
        y1={251}
        x2={258}
        y2={251}
        style={{
          stroke: "var(--color-thread-strong)",
          strokeWidth: 4,
        }}
      />
      <circle cx={274} cy={251} r={16} style={{ fill: "var(--color-pass)" }} />
      <path
        d="M266 251 L272 257 L283 245"
        style={{
          stroke: "var(--color-on-accent)",
          strokeWidth: 3,
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}
