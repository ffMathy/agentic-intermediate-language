import { Stack } from "../../parts/stack";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type WideNode = { name: string; x: number; y: number };

type OutlineNode = { name: string; x: number };

const WIDE_NODES: WideNode[] = [
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

const OUTLINE_NODES: OutlineNode[] = [
  { name: "TicTacToe", x: 4 },
  { name: "App", x: 28 },
  { name: "PlayAGame", x: 52 },
  { name: "NewGameButton", x: 76 },
  { name: "ChooseOpponent", x: 76 },
  { name: "WatchADemo", x: 52 },
  { name: "BoardKit", x: 28 },
  { name: "Engine", x: 28 },
  { name: "GameState", x: 52 },
  { name: "Rules", x: 52 },
  { name: "GameReducer", x: 52 },
  { name: "ComputerPlayer", x: 52 },
  { name: "UiKit", x: 28 },
];

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

const READER_NODES: Record<Reader, string[]> = {
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

const READER_COLOR: Record<Reader, string> = {
  stakeholder: "var(--color-level-product)",
  design: "var(--color-level-experience)",
  engineer: "var(--color-level-system)",
  specialist: "var(--color-level-specialist)",
};

function wideNode(name: string): WideNode {
  return WIDE_NODES.find((n) => n.name === name) as WideNode;
}

function outlineRow(name: string): number {
  return OUTLINE_NODES.findIndex((n) => n.name === name);
}

function rectStyle(lit: boolean, color: string) {
  return lit
    ? { fill: color, stroke: "none" }
    : {
        fill: "var(--color-surface-raised)",
        stroke: "var(--color-border)",
        strokeWidth: 1,
        strokeDasharray: "3 3",
      };
}

function textStyle(lit: boolean) {
  return lit
    ? { fill: "var(--color-on-accent)", fontWeight: 700 }
    : { fill: "var(--color-text-muted)", fontWeight: 400 };
}

/** "a simplified Tic-Tac-Toe tree with thirteen of its nineteen nodes, and a note under it saying which parts are left out; the nodes written at the given reader's level are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const label = `The Tic-Tac-Toe spec tree, with the level written for the ${reader} highlighted`;
  const litNames = READER_NODES[reader];
  const color = READER_COLOR[reader];
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <svg
        className="ail-wide"
        viewBox="0 0 640 200"
        role="img"
        aria-label={label}
        style={{ width: "100%", height: "auto" }}
      >
        {EDGES.map(([parent, child]) => {
          const p = wideNode(parent);
          const c = wideNode(child);
          return (
            <line
              key={`${parent}-${child}`}
              x1={p.x + 48}
              y1={p.y + 24}
              x2={c.x + 48}
              y2={c.y}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          );
        })}
        {WIDE_NODES.map((n) => {
          const lit = litNames.includes(n.name);
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
                style={{ fontFamily: "var(--font-mono)", ...textStyle(lit) }}
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
      <svg
        className="ail-narrow"
        viewBox="0 0 300 372"
        role="img"
        aria-label={label}
        style={{ width: "100%", maxWidth: "320px", height: "auto" }}
      >
        {EDGES.map(([parent, child]) => {
          const pi = outlineRow(parent);
          const ci = outlineRow(child);
          const px = OUTLINE_NODES[pi].x + 10;
          const cx = OUTLINE_NODES[ci].x;
          const bottom = 4 + 28 * pi + 22;
          const centre = 4 + 28 * ci + 11;
          return (
            <g key={`${parent}-${child}`}>
              <line
                x1={px}
                y1={bottom}
                x2={px}
                y2={centre}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <line
                x1={px}
                y1={centre}
                x2={cx}
                y2={centre}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            </g>
          );
        })}
        {OUTLINE_NODES.map((n, i) => {
          const lit = litNames.includes(n.name);
          const y = 4 + 28 * i;
          return (
            <g key={n.name} data-lit={lit ? "true" : "false"}>
              <rect
                x={n.x}
                y={y}
                width={180}
                height={22}
                rx={6}
                style={rectStyle(lit, color)}
              />
              <text
                x={n.x + 10}
                y={y + 11}
                textAnchor="start"
                dominantBaseline="central"
                fontSize={13}
                style={{ fontFamily: "var(--font-mono)", ...textStyle(lit) }}
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
