import type { CSSProperties } from "react";
import { Stack } from "../../parts/stack";

export type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type TreeNode = {
  name: string;
  x: number;
  y: number;
};

const wideNodes: TreeNode[] = [
  { name: "TicTacToe", x: 272, y: 8 },
  { name: "App", x: 60, y: 56 },
  { name: "BoardKit", x: 172, y: 56 },
  { name: "Engine", x: 380, y: 56 },
  { name: "UiKit", x: 488, y: 56 },
  { name: "PlayAGame", x: 8, y: 112 },
  { name: "WatchADemo", x: 112, y: 112 },
  { name: "GameState", x: 224, y: 112 },
  { name: "Rules", x: 328, y: 112 },
  { name: "GameReducer", x: 432, y: 112 },
  { name: "ComputerPlayer", x: 536, y: 112 },
  { name: "NewGameButton", x: 8, y: 168 },
  { name: "ChooseOpponent", x: 112, y: 168 },
];

const edges: [string, string][] = [
  ["TicTacToe", "App"],
  ["TicTacToe", "BoardKit"],
  ["TicTacToe", "Engine"],
  ["TicTacToe", "UiKit"],
  ["App", "PlayAGame"],
  ["App", "WatchADemo"],
  ["Engine", "GameState"],
  ["Engine", "Rules"],
  ["Engine", "GameReducer"],
  ["Engine", "ComputerPlayer"],
  ["PlayAGame", "NewGameButton"],
  ["PlayAGame", "ChooseOpponent"],
];

const outlineOrder: string[] = [
  "TicTacToe",
  "App",
  "PlayAGame",
  "NewGameButton",
  "ChooseOpponent",
  "WatchADemo",
  "BoardKit",
  "Engine",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
  "UiKit",
];

const outlineX: Record<string, number> = {
  TicTacToe: 4,
  App: 28,
  BoardKit: 28,
  Engine: 28,
  UiKit: 28,
  PlayAGame: 52,
  WatchADemo: 52,
  GameState: 52,
  Rules: 52,
  GameReducer: 52,
  ComputerPlayer: 52,
  NewGameButton: 76,
  ChooseOpponent: 76,
};

const readerNodes: Record<Reader, string[]> = {
  stakeholder: ["TicTacToe"],
  design: [
    "App",
    "BoardKit",
    "UiKit",
    "PlayAGame",
    "WatchADemo",
    "NewGameButton",
    "ChooseOpponent",
  ],
  engineer: ["Engine", "GameState", "Rules", "GameReducer"],
  specialist: ["ComputerPlayer"],
};

const readerColor: Record<Reader, string> = {
  stakeholder: "var(--color-level-product)",
  design: "var(--color-level-experience)",
  engineer: "var(--color-level-system)",
  specialist: "var(--color-level-specialist)",
};

const edgeStyle: CSSProperties = {
  stroke: "var(--color-border)",
  strokeWidth: 1,
};

function rectStyle(lit: boolean, reader: Reader): CSSProperties {
  return lit
    ? { fill: readerColor[reader], stroke: "none" }
    : {
        fill: "var(--color-surface-raised)",
        stroke: "var(--color-border)",
        strokeWidth: 1,
        strokeDasharray: "3 3",
      };
}

function textStyle(lit: boolean, fontSize: number): CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize,
    fill: lit ? "var(--color-on-accent)" : "var(--color-text-muted)",
    fontWeight: lit ? 700 : 400,
  };
}

/** "a simplified Tic-Tac-Toe tree with thirteen of its nineteen nodes, and a note under it saying which parts are left out; the nodes written at the given reader's level are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const label = `The Tic-Tac-Toe spec tree, with the level written for the ${reader} highlighted`;
  const litNames = readerNodes[reader];
  const wideByName = new Map(wideNodes.map((n) => [n.name, n]));
  const rowOf = new Map(outlineOrder.map((name, i) => [name, i]));
  const rowY = (name: string) => 4 + 28 * (rowOf.get(name) ?? 0);

  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <svg
        className="ail-wide"
        role="img"
        aria-label={label}
        viewBox="0 0 640 200"
        style={{ width: "100%", height: "auto" }}
      >
        {edges.map(([from, to]) => {
          const p = wideByName.get(from) as TreeNode;
          const c = wideByName.get(to) as TreeNode;
          return (
            <line
              key={`${from}-${to}`}
              x1={p.x + 48}
              y1={p.y + 24}
              x2={c.x + 48}
              y2={c.y}
              style={edgeStyle}
            />
          );
        })}
        {wideNodes.map((n) => {
          const lit = litNames.includes(n.name);
          return (
            <g key={n.name} data-lit={lit ? "true" : "false"}>
              <rect
                x={n.x}
                y={n.y}
                width={96}
                height={24}
                rx={6}
                style={rectStyle(lit, reader)}
              />
              <text
                x={n.x + 48}
                y={n.y + 12}
                textAnchor="middle"
                dominantBaseline="central"
                style={textStyle(lit, 11)}
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
      <svg
        className="ail-narrow"
        role="img"
        aria-label={label}
        viewBox="0 0 300 372"
        style={{ width: "100%", maxWidth: "320px", height: "auto" }}
      >
        {edges.map(([from, to]) => {
          const px = outlineX[from] + 10;
          const pBottom = rowY(from) + 22;
          const cMid = rowY(to) + 11;
          return (
            <g key={`${from}-${to}`}>
              <line x1={px} y1={pBottom} x2={px} y2={cMid} style={edgeStyle} />
              <line
                x1={px}
                y1={cMid}
                x2={outlineX[to]}
                y2={cMid}
                style={edgeStyle}
              />
            </g>
          );
        })}
        {outlineOrder.map((name) => {
          const lit = litNames.includes(name);
          const x = outlineX[name];
          const y = rowY(name);
          return (
            <g key={name} data-lit={lit ? "true" : "false"}>
              <rect
                x={x}
                y={y}
                width={180}
                height={22}
                rx={6}
                style={rectStyle(lit, reader)}
              />
              <text
                x={x + 10}
                y={y + 11}
                textAnchor="start"
                dominantBaseline="central"
                style={textStyle(lit, 13)}
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-tiny)",
          fontStyle: "italic",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Simplified: the six parts inside BoardKit and UiKit are not drawn.
      </p>
    </Stack>
  );
}
