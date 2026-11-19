import { MiniBoard } from "../../../parts/mini-board";

const EDGES: [number, number, number, number][] = [
  [130, 44, 46, 80],
  [130, 44, 130, 80],
  [130, 44, 214, 80],
  [46, 104, 22, 145],
  [46, 104, 46, 145],
  [46, 104, 70, 145],
  [130, 104, 106, 145],
  [130, 104, 130, 145],
  [130, 104, 154, 145],
  [214, 104, 190, 145],
  [214, 104, 214, 145],
  [214, 104, 238, 145],
];

const CHILDREN: { x: number; marks: string }[] = [
  { x: 34, marks: "X_X_O____" },
  { x: 118, marks: "XX__O____" },
  { x: 202, marks: "X___O___X" },
];

const LEAVES: { x: number; fill: string }[] = [
  { x: 22, fill: "var(--color-code-muted)" },
  { x: 46, fill: "var(--color-pass)" },
  { x: 70, fill: "var(--color-code-muted)" },
  { x: 106, fill: "var(--color-pass)" },
  { x: 130, fill: "var(--color-code-muted)" },
  { x: 154, fill: "var(--color-code-muted)" },
  { x: 190, fill: "var(--color-code-muted)" },
  { x: 214, fill: "var(--color-pass)" },
  { x: 238, fill: "var(--color-code-muted)" },
];

const LEGEND: { cy: number; ty: number; fill: string; text: string }[] = [
  { cy: 40, ty: 44, fill: "var(--color-pass)", text: "O wins" },
  { cy: 64, ty: 68, fill: "var(--color-code-muted)", text: "draw" },
  { cy: 88, ty: 92, fill: "var(--color-player-x)", text: "X wins: never" },
];

/** "a board at the top branching into three boards, each branching into three outcomes; every outcome is an O win or a draw, and the legend says X wins never" */
export function SpecialistFigure() {
  return (
    <svg
      viewBox="0 0 360 210"
      role="img"
      aria-label="A tree of possible games: every ending is an O win or a draw, never an X win"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      {EDGES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "var(--color-level-specialist)",
            strokeWidth: 1,
            opacity: 0.5,
          }}
        />
      ))}
      <MiniBoard x={112} y={8} cell={12} marks="X___O____" />
      {CHILDREN.map((child) => (
        <MiniBoard key={child.x} x={child.x} y={80} cell={8} marks={child.marks} />
      ))}
      {LEAVES.map((leaf) => (
        <circle key={leaf.x} cx={leaf.x} cy={150} r={5} style={{ fill: leaf.fill }} />
      ))}
      {LEGEND.map((item) => (
        <circle key={item.cy} cx={270} cy={item.cy} r={5} style={{ fill: item.fill }} />
      ))}
      <line
        x1={262}
        y1={88}
        x2={278}
        y2={88}
        style={{
          stroke: "var(--color-text)",
          strokeWidth: 1.5,
        }}
      />
      {LEGEND.map((item) => (
        <text
          key={item.ty}
          x={282}
          y={item.ty}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fill: "var(--color-text)",
          }}
        >
          {item.text}
        </text>
      ))}
      <text
        x={180}
        y={196}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fill: "var(--color-text-muted)",
        }}
      >
        ≤ 5,478 positions · memoized · every game checked
      </text>
    </svg>
  );
}
