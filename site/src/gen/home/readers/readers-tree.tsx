import { Stack } from "../../parts/stack";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

type Pos = { name: string; x: number; y: number };

const WIDE: Pos[] = [
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

const OUTLINE_ORDER: { name: string; x: number }[] = [
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

const OUTLINE: Pos[] = OUTLINE_ORDER.map((row, i) => ({
  name: row.name,
  x: row.x,
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

const find = (list: Pos[], name: string): Pos =>
  list.find((p) => p.name === name) as Pos;

const rectStyle = (lit: boolean, color: string) =>
  lit
    ? { fill: color, stroke: "none" }
    : {
        fill: "var(--color-surface-raised)",
        stroke: "var(--color-border)",
        strokeWidth: 1,
        strokeDasharray: "3 3",
      };

const textStyle = (lit: boolean) => ({
  fill: lit ? "var(--color-on-accent)" : "var(--color-text-muted)",
  fontWeight: lit ? 700 : 400,
  fontFamily: "var(--font-mono)",
});

const lineStyle = { stroke: "var(--color-border)", strokeWidth: 1 };

/** "the nodes written at the given reader's level are filled with their level's color, and the rest fade back" */
export function ReadersTree({ reader }: { reader: Reader }) {
  const { color, names } = LIT[reader];
  const label = `The Tic-Tac-Toe spec tree, with the level written for the ${reader} highlighted`;
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <svg
        className="ail-wide"
        viewBox="0 0 640 200"
        role="img"
        aria-label={label}
        style={{ width: "100%", height: "auto" }}
      >
        {EDGES.map(([from, to]) => {
          const p = find(WIDE, from);
          const c = find(WIDE, to);
          return (
            <line
              key={`${from}-${to}`}
              x1={p.x + 48}
              y1={p.y + 24}
              x2={c.x + 48}
              y2={c.y}
              style={lineStyle}
            />
          );
        })}
        {WIDE.map((n) => {
          const lit = names.includes(n.name);
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
        viewBox="0 0 300 372"
        role="img"
        aria-label={label}
        style={{ width: "100%", maxWidth: "320px", height: "auto" }}
      >
        {EDGES.map(([from, to]) => {
          const p = find(OUTLINE, from);
          const c = find(OUTLINE, to);
          const lx = p.x + 10;
          const cy = c.y + 11;
          return (
            <g key={`${from}-${to}`}>
              <line x1={lx} y1={p.y + 22} x2={lx} y2={cy} style={lineStyle} />
              <line x1={lx} y1={cy} x2={c.x} y2={cy} style={lineStyle} />
            </g>
          );
        })}
        {OUTLINE.map((n) => {
          const lit = names.includes(n.name);
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
