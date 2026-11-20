import { MiniBoard } from "../../parts/mini-board";

const strata = [
  { y: 96, color: "var(--color-level-product)", name: "Product", reader: "anyone" },
  { y: 154, color: "var(--color-level-experience)", name: "Experience", reader: "design · QA" },
  { y: 212, color: "var(--color-level-system)", name: "System", reader: "engineers" },
  { y: 270, color: "var(--color-level-specialist)", name: "Specialist", reader: "experts" },
];

/** a picture of a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses.", four colored layers named Product, Experience, System and Specialist, a block of code and a small game board, joined by one yellow line */
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
      <rect
        x={20}
        y={10}
        width={280}
        height={72}
        rx={12}
        strokeWidth={1.5}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <path d="M44 80 L40 94 L68 80 Z" style={{ fill: "var(--color-surface)", stroke: "none" }} />
      <path
        d="M44 82 L40 94 L68 82"
        strokeWidth={1.5}
        style={{ fill: "none", stroke: "var(--color-border)" }}
      />
      <text
        x={160}
        y={34}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        style={{ fontFamily: "var(--font-sans)", fill: "var(--color-text-muted)" }}
      >
        Tic-Tac-Toe.
      </text>
      <text
        x={160}
        y={62}
        textAnchor="middle"
        fontSize={19}
        fontWeight={700}
        style={{ fontFamily: "var(--font-display)", fill: "var(--color-text)" }}
      >
        The computer never loses.
      </text>
      {strata.map((s) => (
        <g key={s.name}>
          <rect x={40} y={s.y} width={240} height={52} rx={8} style={{ fill: s.color }} />
          <text
            x={52}
            y={s.y + 31}
            fontSize={13}
            fontWeight={600}
            style={{ fontFamily: "var(--font-sans)", fill: "var(--color-on-accent)" }}
          >
            {s.name}
          </text>
          <text
            x={268}
            y={s.y + 31}
            textAnchor="end"
            fontSize={11}
            opacity={0.85}
            style={{ fontFamily: "var(--font-sans)", fill: "var(--color-on-accent)" }}
          >
            {s.reader}
          </text>
        </g>
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
        style={{ fontFamily: "var(--font-sans)", fill: "var(--color-text-muted)" }}
      >
        more precise
      </text>
      <line
        x1={160}
        y1={82}
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
        style={{ fontFamily: "var(--font-mono)", fill: "var(--color-code-text)" }}
      >
        export function choose(
      </text>
      <text
        x={66}
        y={368}
        fontSize={11}
        style={{ fontFamily: "var(--font-mono)", fill: "var(--color-code-text)" }}
      >
        board: Board, me: Mark = "O"
      </text>
      <text
        x={54}
        y={384}
        fontSize={11}
        style={{ fontFamily: "var(--font-mono)", fill: "var(--color-code-text)" }}
      >
        {"): number {"}
      </text>
      <MiniBoard x={118} y={406} cell={28} marks="X___O____" />
    </svg>
  );
}
