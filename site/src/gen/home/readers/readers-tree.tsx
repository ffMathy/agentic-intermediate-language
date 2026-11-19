import { Stack } from "../../parts/stack";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type TreeNode = {
  name: string;
  x: number;
  y: number;
};

const WIDE_NODES: TreeNode[] = [
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

const OUTLINE_ORDER: string[] = [
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

const OUTLINE_X: Record<string, number> = {
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

const OUTLINE_NODES: TreeNode[] = OUTLINE_ORDER.map((name, i) => ({
  name,
  x: OUTLINE_X[name],
  y: 4 + 28 * i,
}));

const EDGES: [string, string][] = [
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

const LIT: Record<Reader, { color: string; names: string[] }> = {
  stakeholder: {
    color: "var(--color-level-product)",
    names: ["TicTacToe"],
  },
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

function findNode(nodes: TreeNode[], name: string): TreeNode {
  return nodes.find((n) => n.name === name) as TreeNode;
}

function rectStyle(lit: boolean, color: string): React.CSSProperties {
  return lit
    ? { fill: color }
    : {
        fill: "var(--color-surface-raised)",
        stroke: "var(--color-border)",
        strokeWidth: 1,
        strokeDasharray: "3 3",
      };
}

function textStyle(lit: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fill: lit ? "var(--color-on-accent)" : "var(--color-text-muted)",
    fontWeight: lit ? 700 : 400,
  };
}

const LINE_STYLE: React.CSSProperties = {
  stroke: "var(--color-border)",
  strokeWidth: 1,
};

/** "a simplified Tic-Tac-Toe tree with thirteen of its nineteen nodes, and a note under it saying which parts are left out; the nodes written at the given reader's level are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const label = `The Tic-Tac-Toe spec tree, with the level written for the ${reader} highlighted`;
  const { color, names } = LIT[reader];
  const isLit = (name: string): boolean => names.includes(name);

  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <svg
        className="ail-wide"
        role="img"
        aria-label={label}
        viewBox="0 0 640 200"
        style={{ width: "100%", height: "auto" }}
      >
        {EDGES.map(([from, to]) => {
          const p = findNode(WIDE_NODES, from);
          const c = findNode(WIDE_NODES, to);
          return (
            <line
              key={`${from}-${to}`}
              x1={p.x + 48}
              y1={p.y + 24}
              x2={c.x + 48}
              y2={c.y}
              style={LINE_STYLE}
            />
          );
        })}
        {WIDE_NODES.map((n) => {
          const lit = isLit(n.name);
          return (
            <g key={n.name} data-lit={lit ? "true" : "false"}>
              <rect
                x={n.x}
                y={n.y}
                width={96}
                height={24}
                rx={6}
                style={rectStyle(lit, color)}
              />
              <text
                x={n.x + 48}
                y={n.y + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                style={textStyle(lit)}
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
        {EDGES.map(([from, to]) => {
          const p = findNode(OUTLINE_NODES, from);
          const c = findNode(OUTLINE_NODES, to);
          const cx = p.x + 10;
          const cy = c.y + 11;
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={cx}
                y1={p.y + 22}
                x2={cx}
                y2={cy}
                style={LINE_STYLE}
              />
              <line x1={cx} y1={cy} x2={c.x} y2={cy} style={LINE_STYLE} />
            </g>
          );
        })}
        {OUTLINE_NODES.map((n) => {
          const lit = isLit(n.name);
          return (
            <g key={n.name} data-lit={lit ? "true" : "false"}>
              <rect
                x={n.x}
                y={n.y}
                width={180}
                height={22}
                rx={6}
                style={rectStyle(lit, color)}
              />
              <text
                x={n.x + 10}
                y={n.y + 11}
                textAnchor="start"
                dominantBaseline="central"
                fontSize={13}
                style={textStyle(lit)}
              >
                {n.name}
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
