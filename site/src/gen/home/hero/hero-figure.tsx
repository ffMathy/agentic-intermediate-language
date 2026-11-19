import { MiniBoard } from "../../parts/mini-board";

const strata = [
  { y: 96, color: "var(--color-level-product)", name: "Product", reader: "anyone" },
  { y: 154, color: "var(--color-level-experience)", name: "Experience", reader: "design · QA" },
  { y: 212, color: "var(--color-level-system)", name: "System", reader: "engineers" },
  { y: 270, color: "var(--color-level-specialist)", name: "Specialist", reader: "experts" },
];

/** a picture of a speech bubble saying "The computer never loses.", four colored layers named Product, Experience, System and Specialist, a block of code and a small game board, joined by one yellow line */
export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 320 500"
      role="img"
      aria-label="One sentence sinks through four levels of spec and comes out as code and a game board"
      style={{
        width: "100%",
        maxWidth: "340px",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    >
      <path
        d="M44 66 L40 86 L68 66"
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
          strokeWidth: 1.5,
        }}
      />
      <rect
        x={20}
        y={10}
        width={280}
        height={56}
        rx={12}
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
          strokeWidth: 1.5,
        }}
      />
      <text
        x={160}
        y={44}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 600,
          fill: "var(--color-text)",
        }}
      >
        The computer never loses.
      </text>
      {strata.map((stratum) => (
        <g key={stratum.name}>
          <rect
            x={40}
            y={stratum.y}
            width={240}
            height={52}
            rx={8}
            style={{ fill: stratum.color }}
          />
          <text
            x={52}
            y={stratum.y + 31}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              fill: "var(--color-on-accent)",
            }}
          >
            {stratum.name}
          </text>
          <text
            x={268}
            y={stratum.y + 31}
            textAnchor="end"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fill: "var(--color-on-accent)",
              opacity: 0.85,
            }}
          >
            {stratum.reader}
          </text>
        </g>
      ))}
      <line
        x1={28}
        y1={104}
        x2={28}
        y2={312}
        style={{
          stroke: "var(--color-text-muted)",
          strokeWidth: 1.5,
          fill: "none",
        }}
      />
      <path
        d="M23 304 L28 314 L33 304"
        style={{
          stroke: "var(--color-text-muted)",
          strokeWidth: 1.5,
          fill: "none",
        }}
      />
      <text
        x={14}
        y={209}
        transform="rotate(-90 14 209)"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fill: "var(--color-text-muted)",
        }}
      >
        more precise
      </text>
      <line
        x1={160}
        y1={66}
        x2={160}
        y2={406}
        style={{
          stroke: "var(--color-thread)",
          strokeWidth: 3,
          strokeLinecap: "round",
          strokeDasharray: 400,
          animation: "ail-thread 2.4s ease-out 1 both",
        }}
      />
      <rect
        x={40}
        y={330}
        width={240}
        height={64}
        rx={8}
        style={{ fill: "var(--color-code)" }}
      />
      <text
        x={54}
        y={352}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fill: "var(--color-code-text)",
        }}
      >
        {"export function choose("}
      </text>
      <text
        x={66}
        y={368}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fill: "var(--color-code-text)",
        }}
      >
        {"board: Board, me: Mark = \"O\""}
      </text>
      <text
        x={54}
        y={384}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fill: "var(--color-code-text)",
        }}
      >
        {"): number {"}
      </text>
      <MiniBoard x={118} y={406} cell={28} marks="X___O____" />
    </svg>
  );
}
