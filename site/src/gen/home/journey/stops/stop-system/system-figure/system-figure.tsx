import { MiniBoard } from "../../../../../parts/mini-board/mini-board";

const sans = "var(--font-sans)";
const mono = "var(--font-mono)";
const muted = "var(--color-text-muted)";

const answers = [
  { y: 14, text: "won · X", fill: "var(--color-thread)", stroke: "var(--color-thread-strong)" },
  { y: 49, text: "draw", fill: "var(--color-surface)", stroke: "var(--color-border)" },
  { y: 84, text: "playing", fill: "var(--color-surface)", stroke: "var(--color-border)" },
];

/** a board with its top row of X marks highlighted and its empty squares numbered, an arrow into the rule, and three possible answers, the first of them lit */
export function SystemFigure() {
  return (
    <svg
      viewBox="0 0 360 164"
      role="img"
      aria-label="A board goes into the one rule and comes out as won, draw or playing"
      style={{ width: "100%", maxWidth: "360px", height: "auto", display: "block" }}
    >
      <MiniBoard x={8} y={20} cell={28} marks="XXXOO____" highlight={[0, 1, 2]} numbers={true} />
      <text x={8} y={124} fontSize={11} style={{ fill: muted, fontFamily: sans }}>
        9 squares, row by row
      </text>
      <line x1={96} y1={62} x2={132} y2={62} strokeWidth={2} style={{ stroke: muted }} />
      <path d="M126 57 L134 62 L126 67 Z" style={{ fill: muted }} />
      <rect x={136} y={44} width={96} height={36} rx={8} style={{ fill: "var(--color-level-system)" }} />
      <text
        x={184}
        y={67}
        textAnchor="middle"
        fontSize={13}
        style={{ fill: "var(--color-on-accent)", fontFamily: mono }}
      >
        evaluate
      </text>
      <line x1={232} y1={62} x2={268} y2={27} strokeWidth={1.5} style={{ stroke: muted }} />
      <line x1={232} y1={62} x2={268} y2={62} strokeWidth={1.5} style={{ stroke: muted }} />
      <line x1={232} y1={62} x2={268} y2={97} strokeWidth={1.5} style={{ stroke: muted }} />
      {answers.map((answer) => (
        <g key={answer.text}>
          <rect
            x={268}
            y={answer.y}
            width={84}
            height={26}
            rx={13}
            style={{ fill: answer.fill, stroke: answer.stroke }}
          />
          <text
            x={310}
            y={answer.y + 17}
            textAnchor="middle"
            fontSize={13}
            style={{ fill: "var(--color-text)", fontFamily: mono }}
          >
            {answer.text}
          </text>
        </g>
      ))}
      <path d="M136 120 V128 H232 V120" strokeWidth={1.5} style={{ stroke: muted, fill: "none" }} />
      <text x={184} y={152} textAnchor="middle" fontSize={13} style={{ fill: muted, fontFamily: sans }}>
        Engine: shared by play and watch
      </text>
    </svg>
  );
}
