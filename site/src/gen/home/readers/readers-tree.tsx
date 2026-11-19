type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type TreeNode = {
  name: string;
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
};

const NODES: TreeNode[] = [
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

const EDGES: Edge[] = [
  { from: "TicTacToe", to: "App" },
  { from: "TicTacToe", to: "BoardKit" },
  { from: "TicTacToe", to: "Engine" },
  { from: "TicTacToe", to: "UiKit" },
  { from: "App", to: "PlayAGame" },
  { from: "App", to: "WatchADemo" },
  { from: "Engine", to: "GameState" },
  { from: "Engine", to: "Rules" },
  { from: "Engine", to: "GameReducer" },
  { from: "Engine", to: "ComputerPlayer" },
  { from: "PlayAGame", to: "NewGameButton" },
  { from: "PlayAGame", to: "ChooseOpponent" },
];

const READERS: Record<Reader, { color: string; lit: string[] }> = {
  stakeholder: {
    color: "var(--color-level-product)",
    lit: ["TicTacToe"],
  },
  design: {
    color: "var(--color-level-experience)",
    lit: [
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
    lit: ["Engine", "GameState", "Rules", "GameReducer"],
  },
  specialist: {
    color: "var(--color-level-specialist)",
    lit: ["ComputerPlayer"],
  },
};

const NODE_WIDTH = 96;
const NODE_HEIGHT = 24;

function findNode(name: string): TreeNode {
  const node = NODES.find((n) => n.name === name);
  if (node === undefined) {
    throw new Error(name);
  }
  return node;
}

/** "a simplified Tic-Tac-Toe tree with fourteen nodes; the nodes the given reader reads are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const { color, lit } = READERS[reader];
  const label = `The Tic-Tac-Toe spec tree, with what the ${reader} reads highlighted`;
  return (
    <svg
      viewBox="0 0 640 200"
      role="img"
      aria-label={label}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {EDGES.map((edge) => {
        const parent = findNode(edge.from);
        const child = findNode(edge.to);
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={parent.x + NODE_WIDTH / 2}
            y1={parent.y + NODE_HEIGHT}
            x2={child.x + NODE_WIDTH / 2}
            y2={child.y}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        );
      })}
      {NODES.map((node) => {
        const isLit = lit.includes(node.name);
        return (
          <g
            key={node.name}
            data-lit={isLit ? "true" : "false"}
            opacity={isLit ? undefined : 0.55}
          >
            {isLit ? (
              <rect
                x={node.x}
                y={node.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={6}
                fill={color}
              />
            ) : (
              <rect
                x={node.x}
                y={node.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={6}
                fill="var(--color-surface)"
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            )}
            <text
              x={node.x + NODE_WIDTH / 2}
              y={node.y + NODE_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontFamily="var(--font-mono)"
              fontWeight={isLit ? 700 : undefined}
              fill={isLit ? "var(--color-on-accent)" : "var(--color-text-muted)"}
            >
              {node.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
