import { MiniBoard } from "../../../parts/mini-board";

const children = [
  { x: 34, cx: 46, marks: "X_X_O____" },
  { x: 118, cx: 130, marks: "XX__O____" },
  { x: 202, cx: 214, marks: "X___O___X" },
];

const leaves = [22, 46, 70, 106, 130, 154, 190, 214, 238];

const passLeaves = [1, 3, 7];

const legend = [
  { cy: 40, ty: 44, fill: "var(--color-pass)", text: "O wins" },
  { cy: 64, ty: 68, fill: "var(--color-code-muted)", text: "draw" },
  { cy: 88, ty: 92, fill: "var(--color-player-x)", text: "X wins: never" },
];

/** a board at the top branching into three boards, each branching into three outcomes; every outcome is an O win or a draw, and the legend says X wins never */
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
      <g
        style={{
          stroke: "var(--color-level-specialist)",
          strokeWidth: 1,
          opacity: 0.5,
        }}
      >
        {children.map((child) => (
          <line key={`root-${child.cx}`} x1={130} y1={44} x2={child.cx} y2={80} />
        ))}
        {children.flatMap((child) =>
          [child.cx - 24, child.cx, child.cx + 24].map((leafX) => (
            <line
              key={`leaf-${child.cx}-${leafX}`}
              x1={child.cx}
              y1={104}
              x2={leafX}
              y2={145}
            />
          )),
        )}
      </g>
      <MiniBoard x={112} y={8} cell={12} marks="X___O____" />
      {children.map((child) => (
        <MiniBoard key={child.x} x={child.x} y={80} cell={8} marks={child.marks} />
      ))}
      {leaves.map((leafX, index) => (
        <circle
          key={leafX}
          cx={leafX}
          cy={150}
          r={5}
          style={{
            fill: passLeaves.includes(index)
              ? "var(--color-pass)"
              : "var(--color-code-muted)",
          }}
        />
      ))}
      {legend.map((item) => (
        <circle key={`dot-${item.cy}`} cx={270} cy={item.cy} r={5} style={{ fill: item.fill }} />
      ))}
      <line
        x1={262}
        y1={88}
        x2={278}
        y2={88}
        style={{ stroke: "var(--color-text)", strokeWidth: 1.5 }}
      />
      {legend.map((item) => (
        <text
          key={`text-${item.ty}`}
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
