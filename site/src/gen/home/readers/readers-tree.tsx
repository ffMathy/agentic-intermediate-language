import type { CSSProperties } from "react";
import { Stack } from "../../parts/stack";

export type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type NodeName =
  | "TicTacToe"
  | "App"
  | "BoardKit"
  | "Engine"
  | "UiKit"
  | "PlayAGame"
  | "WatchADemo"
  | "GameState"
  | "Rules"
  | "GameReducer"
  | "ComputerPlayer"
  | "NewGameButton"
  | "ChooseOpponent";

const WIDE: Record<NodeName, { x: number; y: number }> = {
  TicTacToe: { x: 272, y: 8 },
  App: { x: 60, y: 56 },
  BoardKit: { x: 172, y: 56 },
  Engine: { x: 380, y: 56 },
  UiKit: { x: 488, y: 56 },
  PlayAGame: { x: 8, y: 112 },
  WatchADemo: { x: 112, y: 112 },
  GameState: { x: 224, y: 112 },
  Rules: { x: 328, y: 112 },
  GameReducer: { x: 432, y: 112 },
  ComputerPlayer: { x: 536, y: 112 },
  NewGameButton: { x: 8, y: 168 },
  ChooseOpponent: { x: 112, y: 168 },
};

const WIDE_ORDER: NodeName[] = [
  "TicTacToe",
  "App",
  "BoardKit",
  "Engine",
  "UiKit",
  "PlayAGame",
  "WatchADemo",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
  "NewGameButton",
  "ChooseOpponent",
];

const EDGES: [NodeName, NodeName][] = [
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

const OUTLINE_ORDER: NodeName[] = [
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

const OUTLINE_X: Record<NodeName, number> = {
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

const LIT: Record<Reader, { color: string; names: NodeName[] }> = {
  stakeholder: { color: "var(--color-level-product)", names: ["TicTacToe"] },
  design: {
    color: "var(--color-level-experience)",
    names: [
      "App",
      "BoardKit",
      "UiKit",
      "PlayAGame",
      "WatchADemo",
      "NewGameButton",
      "ChooseOpponent",
    ],
  },
  engineer: {
    color: "var(--color-level-system)",
    names: ["Engine", "GameState", "Rules", "GameReducer"],
  },
  specialist: {
    color: "var(--color-level-specialist)",
    names: ["ComputerPlayer"],
  },
};

const EDGE_STYLE: CSSProperties = {
  stroke: "var(--color-border)",
  strokeWidth: 1,
};

const UNLIT_RECT: CSSProperties = {
  fill: "var(--color-surface-raised)",
  stroke: "var(--color-border)",
  strokeWidth: 1,
  strokeDasharray: "3 3",
};

function outlineY(name: NodeName): number {
  return 4 + 28 * OUTLINE_ORDER.indexOf(name);
}

/** "a simplified Tic-Tac-Toe tree with thirteen of its nineteen nodes, and a note under it saying which parts are left out; the nodes written at the given reader's level are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const label = `The Tic-Tac-Toe spec tree, with the level written for the ${reader} highlighted`;
  const lit = LIT[reader];
  const isLit = (name: NodeName): boolean => lit.names.includes(name);
  const rectStyle = (name: NodeName): CSSProperties =>
    isLit(name) ? { fill: lit.color } : UNLIT_RECT;
  const textStyle = (name: NodeName, size: number): CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: size,
    fill: isLit(name) ? "var(--color-on-accent)" : "var(--color-text-muted)",
    fontWeight: isLit(name) ? 700 : 400,
  });

  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <svg
        className="ail-wide"
        viewBox="0 0 640 200"
        role="img"
        aria-label={label}
        style={{ width: "100%", height: "auto" }}
      >
        {EDGES.map(([parent, child]) => (
          <line
            key={`${parent}-${child}`}
            x1={WIDE[parent].x + 48}
            y1={WIDE[parent].y + 24}
            x2={WIDE[child].x + 48}
            y2={WIDE[child].y}
            style={EDGE_STYLE}
          />
        ))}
        {WIDE_ORDER.map((name) => (
          <g key={name} data-lit={isLit(name) ? "true" : "false"}>
            <rect
              x={WIDE[name].x}
              y={WIDE[name].y}
              width={96}
              height={24}
              rx={6}
              style={rectStyle(name)}
            />
            <text
              x={WIDE[name].x + 48}
              y={WIDE[name].y + 12}
              textAnchor="middle"
              dominantBaseline="central"
              style={textStyle(name, 11)}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
      <svg
        className="ail-narrow"
        viewBox="0 0 300 372"
        role="img"
        aria-label={label}
        style={{ width: "100%", maxWidth: "320px", height: "auto" }}
      >
        {EDGES.map(([parent, child]) => {
          const px = OUTLINE_X[parent] + 10;
          const midY = outlineY(child) + 11;
          return (
            <g key={`${parent}-${child}`}>
              <line
                x1={px}
                y1={outlineY(parent) + 22}
                x2={px}
                y2={midY}
                style={EDGE_STYLE}
              />
              <line
                x1={px}
                y1={midY}
                x2={OUTLINE_X[child]}
                y2={midY}
                style={EDGE_STYLE}
              />
            </g>
          );
        })}
        {OUTLINE_ORDER.map((name) => (
          <g key={name} data-lit={isLit(name) ? "true" : "false"}>
            <rect
              x={OUTLINE_X[name]}
              y={outlineY(name)}
              width={180}
              height={22}
              rx={6}
              style={rectStyle(name)}
            />
            <text
              x={OUTLINE_X[name] + 10}
              y={outlineY(name) + 11}
              textAnchor="start"
              dominantBaseline="central"
              style={textStyle(name, 13)}
            >
              {name}
            </text>
          </g>
        ))}
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
