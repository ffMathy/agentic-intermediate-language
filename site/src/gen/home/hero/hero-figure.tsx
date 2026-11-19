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
        strokeWidth={1.5}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <rect
        x={20}
        y={10}
        width={280}
        height={56}
        rx={12}
        strokeWidth={1.5}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <text
        x={160}
        y={44}
        textAnchor="middle"
        fontSize={18}
        fontWeight={600}
        style={{ fill: "var(--color-text)", fontFamily: "var(--font-sans)" }}
      >
        The computer never loses.
      </text>
      {strata.map((s) => (
        <rect key={s.name} x={40} y={s.y} width={240} height={52} rx={8} style={{ fill: s.color }} />
      ))}
      {strata.map((s) => (
        <text
          key={s.name}
          x={52}
          y={s.y + 31}
          fontSize={13}
          fontWeight={600}
          style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
        >
          {s.name}
        </text>
      ))}
      {strata.map((s) => (
        <text
          key={s.name}
          x={268}
          y={s.y + 31}
          textAnchor="end"
          fontSize={11}
          opacity={0.85}
          style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
        >
          {s.reader}
        </text>
      ))}
      <line
        x1={28}
        y1={104}
        x2={28}
        y2={312}
        strokeWidth={1.5}
        style={{ fill: "none", stroke: "var(--color-text-muted)" }}
      />
      <path
        d="M23 304 L28 314 L33 304"
        strokeWidth={1.5}
        style={{ fill: "none", stroke: "var(--color-text-muted)" }}
      />
      <text
        x={14}
        y={209}
        transform="rotate(-90 14 209)"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
      >
        more precise
      </text>
      <line
        x1={160}
        y1={66}
        x2={160}
        y2={406}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={400}
        style={{
          stroke: "var(--color-thread)",
          animation: "ail-thread 2.4s ease-out 1 both",
        }}
      />
      <rect x={40} y={330} width={240} height={64} rx={8} style={{ fill: "var(--color-code)" }} />
      <text
        x={54}
        y={352}
        fontSize={11}
        style={{ fill: "var(--color-code-text)", fontFamily: "var(--font-mono)" }}
      >
        export function choose(
      </text>
      <text
        x={66}
        y={368}
        fontSize={11}
        style={{ fill: "var(--color-code-text)", fontFamily: "var(--font-mono)" }}
      >
        {"board: Board, me: Mark = \"O\""}
      </text>
      <text
        x={54}
        y={384}
        fontSize={11}
        style={{ fill: "var(--color-code-text)", fontFamily: "var(--font-mono)" }}
      >
        {"): number {"}
      </text>
      <MiniBoard x={118} y={406} cell={28} marks="X___O____" />
    </svg>
  );
}
