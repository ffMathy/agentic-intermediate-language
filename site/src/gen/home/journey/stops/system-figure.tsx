import { MiniBoard } from "../../../parts/mini-board";

const answers = [
  { y: 14, text: "won · X", won: true },
  { y: 49, text: "draw", won: false },
  { y: 84, text: "playing", won: false },
];

/** "a board with its top row of X marks highlighted and its empty squares numbered, an arrow into the rule, and three possible answers, the first of them lit" */
export function SystemFigure() {
  return (
    <svg
      viewBox="0 0 360 164"
      role="img"
      aria-label="A board goes into the one rule and comes out as won, draw or playing"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      <MiniBoard
        x={8}
        y={20}
        cell={28}
        marks="XXXOO____"
        highlight={[0, 1, 2]}
        numbers={true}
      />
      <text
        x={8}
        y={124}
        fontSize={11}
        style={{
          fill: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        9 squares, row by row
      </text>
      <line
        x1={96}
        y1={62}
        x2={132}
        y2={62}
        strokeWidth={2}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <path
        d="M126 57 L134 62 L126 67 Z"
        style={{ fill: "var(--color-text-muted)" }}
      />
      <rect
        x={136}
        y={44}
        width={96}
        height={36}
        rx={8}
        style={{ fill: "var(--color-level-system)" }}
      />
      <text
        x={184}
        y={67}
        textAnchor="middle"
        fontSize={13}
        style={{
          fill: "var(--color-on-accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        evaluate
      </text>
      <line
        x1={232}
        y1={62}
        x2={268}
        y2={27}
        strokeWidth={1.5}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <line
        x1={232}
        y1={62}
        x2={268}
        y2={62}
        strokeWidth={1.5}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <line
        x1={232}
        y1={62}
        x2={268}
        y2={97}
        strokeWidth={1.5}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      {answers.map((answer) => (
        <g key={answer.text}>
          <rect
            x={268}
            y={answer.y}
            width={84}
            height={26}
            rx={13}
            style={{
              fill: answer.won ? "var(--color-thread)" : "var(--color-surface)",
              stroke: answer.won
                ? "var(--color-thread-strong)"
                : "var(--color-border)",
            }}
          />
          <text
            x={310}
            y={answer.y + 17}
            textAnchor="middle"
            fontSize={12}
            style={{
              fill: "var(--color-text)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {answer.text}
          </text>
        </g>
      ))}
      <path
        d="M136 120 V128 H232 V120"
        strokeWidth={1.5}
        style={{ stroke: "var(--color-text-muted)", fill: "none" }}
      />
      <text
        x={184}
        y={150}
        textAnchor="middle"
        fontSize={11}
        style={{
          fill: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Engine: shared by play and watch
      </text>
    </svg>
  );
}
