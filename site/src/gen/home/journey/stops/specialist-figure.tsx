import { MiniBoard } from "../../../parts/mini-board";

const childXs = [46, 130, 214];
const leafXs = [22, 46, 70, 106, 130, 154, 190, 214, 238];
const passLeaves = [1, 3, 7];

const edgeStyle = {
  stroke: "var(--color-level-specialist)",
  strokeWidth: 1,
  opacity: 0.5,
};

const legendTextStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fill: "var(--color-text)",
};

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
      {childXs.map((cx) => (
        <line key={`root-${cx}`} x1={130} y1={44} x2={cx} y2={80} style={edgeStyle} />
      ))}
      {childXs.flatMap((cx) =>
        [cx - 24, cx, cx + 24].map((lx) => (
          <line
            key={`child-${cx}-${lx}`}
            x1={cx}
            y1={104}
            x2={lx}
            y2={145}
            style={edgeStyle}
          />
        )),
      )}
      <MiniBoard x={112} y={8} cell={12} marks="X___O____" />
      <MiniBoard x={34} y={80} cell={8} marks="X_X_O____" />
      <MiniBoard x={118} y={80} cell={8} marks="XX__O____" />
      <MiniBoard x={202} y={80} cell={8} marks="X___O___X" />
      {leafXs.map((lx, i) => (
        <circle
          key={`leaf-${i}`}
          cx={lx}
          cy={150}
          r={5}
          style={{
            fill: passLeaves.includes(i)
              ? "var(--color-pass)"
              : "var(--color-code-muted)",
          }}
        />
      ))}
      <circle cx={270} cy={40} r={5} style={{ fill: "var(--color-pass)" }} />
      <circle cx={270} cy={64} r={5} style={{ fill: "var(--color-code-muted)" }} />
      <circle cx={270} cy={88} r={5} style={{ fill: "var(--color-player-x)" }} />
      <line
        x1={262}
        y1={88}
        x2={278}
        y2={88}
        style={{ stroke: "var(--color-text)", strokeWidth: 1.5 }}
      />
      <text x={282} y={44} style={legendTextStyle}>
        O wins
      </text>
      <text x={282} y={68} style={legendTextStyle}>
        draw
      </text>
      <text x={282} y={92} style={legendTextStyle}>
        X wins: never
      </text>
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
