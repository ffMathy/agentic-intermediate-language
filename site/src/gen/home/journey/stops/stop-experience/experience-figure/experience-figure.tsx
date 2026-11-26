import { MiniBoard } from "../../../../../parts/mini-board/mini-board";

/** three small boards: empty, then X in the center, then an O answering in the top-left corner, with "300 ms" between the last two and the status line under them */
export function ExperienceFigure() {
  const captionStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    fill: "var(--color-text-muted)",
  };
  return (
    <svg
      viewBox="0 0 360 176"
      role="img"
      aria-label="Three frames: an empty board, X in the center, then O answers after 300 ms"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      <MiniBoard x={6} y={10} cell={26} marks="_________" />
      <MiniBoard x={141} y={10} cell={26} marks="____X____" />
      <MiniBoard x={276} y={10} cell={26} marks="O___X____" />
      <line
        x1={90}
        y1={49}
        x2={133}
        y2={49}
        style={{ stroke: "var(--color-text-muted)", strokeWidth: 2 }}
      />
      <line
        x1={225}
        y1={49}
        x2={268}
        y2={49}
        style={{ stroke: "var(--color-text-muted)", strokeWidth: 2 }}
      />
      <path
        d="M127 44 L135 49 L127 54 Z"
        style={{ fill: "var(--color-text-muted)" }}
      />
      <path
        d="M262 44 L270 49 L262 54 Z"
        style={{ fill: "var(--color-text-muted)" }}
      />
      <circle
        cx={247}
        cy={26}
        r={8}
        style={{
          fill: "none",
          stroke: "var(--color-text-muted)",
          strokeWidth: 1.5,
        }}
      />
      <line
        x1={247}
        y1={26}
        x2={247}
        y2={21}
        style={{ stroke: "var(--color-text-muted)", strokeWidth: 1.5 }}
      />
      <line
        x1={247}
        y1={16}
        x2={247}
        y2={14}
        style={{ stroke: "var(--color-text-muted)", strokeWidth: 1.5 }}
      />
      <text
        x={247}
        y={72}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fill: "var(--color-text)",
        }}
      >
        300 ms
      </text>
      <text
        x={45}
        y={106}
        textAnchor="middle"
        style={{ ...captionStyle, fontWeight: 700 }}
      >
        Given:
      </text>
      <text x={45} y={122} textAnchor="middle" style={captionStyle}>
        vs computer
      </text>
      <text
        x={180}
        y={106}
        textAnchor="middle"
        style={{ ...captionStyle, fontWeight: 700 }}
      >
        When:
      </text>
      <text x={180} y={122} textAnchor="middle" style={captionStyle}>
        X picks
      </text>
      <text
        x={315}
        y={106}
        textAnchor="middle"
        style={{ ...captionStyle, fontWeight: 700 }}
      >
        Then:
      </text>
      <text x={315} y={122} textAnchor="middle" style={captionStyle}>
        O answers
      </text>
      <rect
        x={120}
        y={132}
        width={120}
        height={32}
        rx={16}
        style={{
          fill: "var(--color-surface)",
          stroke: "var(--color-border)",
        }}
      />
      <text
        x={180}
        y={153}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          fontWeight: 600,
          fill: "var(--color-text)",
        }}
      >
        <tspan style={{ fill: "var(--color-player-x)" }}>X</tspan>
        {"'s turn"}
      </text>
    </svg>
  );
}
