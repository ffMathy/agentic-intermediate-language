import { MiniBoard } from "../../../parts/mini-board";

const label = "Three frames: an empty board, X in the center, then O answers after 300 ms";

const frames = [
  { x: 6, cx: 45, marks: "_________", first: "Given:", second: "vs computer" },
  { x: 141, cx: 180, marks: "____X____", first: "When:", second: "X picks" },
  { x: 276, cx: 315, marks: "O___X____", first: "Then:", second: "O answers" },
];

const muted = "var(--color-text-muted)";

/** three small boards: empty, then X in the center, then an O answering in the top-left corner, with "300 ms" between the last two and the status line under them */
export function ExperienceFigure() {
  return (
    <svg
      viewBox="0 0 360 176"
      role="img"
      aria-label={label}
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      {frames.map((frame) => (
        <MiniBoard key={frame.x} x={frame.x} y={10} cell={26} marks={frame.marks} />
      ))}
      <line x1={90} y1={49} x2={133} y2={49} stroke={muted} strokeWidth={2} />
      <line x1={225} y1={49} x2={268} y2={49} stroke={muted} strokeWidth={2} />
      <path d="M127 44 L135 49 L127 54 Z" fill={muted} />
      <path d="M262 44 L270 49 L262 54 Z" fill={muted} />
      <circle cx={247} cy={26} r={8} fill="none" stroke={muted} strokeWidth={1.5} />
      <line x1={247} y1={26} x2={247} y2={21} stroke={muted} strokeWidth={1.5} />
      <line x1={247} y1={16} x2={247} y2={14} stroke={muted} strokeWidth={1.5} />
      <text
        x={247}
        y={72}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-text)"
        fontFamily="var(--font-mono)"
      >
        {"300 ms"}
      </text>
      {frames.map((frame) => (
        <text
          key={`a-${frame.x}`}
          x={frame.cx}
          y={106}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill={muted}
          fontFamily="var(--font-sans)"
        >
          {frame.first}
        </text>
      ))}
      {frames.map((frame) => (
        <text
          key={`b-${frame.x}`}
          x={frame.cx}
          y={122}
          textAnchor="middle"
          fontSize={13}
          fill={muted}
          fontFamily="var(--font-sans)"
        >
          {frame.second}
        </text>
      ))}
      <rect
        x={120}
        y={132}
        width={120}
        height={32}
        rx={16}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
      />
      <text
        x={180}
        y={153}
        textAnchor="middle"
        fontSize={16}
        fontWeight={600}
        fill="var(--color-text)"
        fontFamily="var(--font-sans)"
      >
        <tspan fill="var(--color-player-x)">{"X"}</tspan>
        {"'s turn"}
      </text>
    </svg>
  );
}
