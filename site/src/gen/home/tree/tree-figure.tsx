type Box = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  fontSize: number;
};

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const experience = "var(--color-level-experience)";
const system = "var(--color-level-system)";
const specialist = "var(--color-level-specialist)";
const product = "var(--color-level-product)";

const label =
  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted";

const column = (name: string, x: number, fill: string): Box => ({
  name,
  x,
  y: 100,
  width: 220,
  height: 44,
  fill,
  fontSize: 15,
});

const child = (name: string, columnX: number, y: number, fill: string): Box => ({
  name,
  x: columnX + 32,
  y,
  width: 188,
  height: 38,
  fill,
  fontSize: 13,
});

const nested = (name: string, y: number): Box => ({
  name,
  x: 74,
  y,
  width: 156,
  height: 38,
  fill: experience,
  fontSize: 13,
});

const boxes: Box[] = [
  {
    name: "TicTacToe",
    x: 380,
    y: 10,
    width: 200,
    height: 44,
    fill: product,
    fontSize: 16,
  },
  column("App", 10, experience),
  column("BoardKit", 250, experience),
  column("Engine", 490, system),
  column("UiKit", 730, experience),
  child("PlayAGame", 10, 166, experience),
  child("WatchADemo", 10, 310, experience),
  nested("NewGameButton", 214),
  nested("ChooseOpponent", 262),
  child("BoardView", 250, 166, experience),
  child("StatusLine", 250, 214, experience),
  child("GameState", 490, 166, system),
  child("Rules", 490, 214, system),
  child("GameReducer", 490, 262, system),
  child("ComputerPlayer", 490, 310, specialist),
  child("Stack", 730, 166, experience),
  child("Text", 730, 214, experience),
  child("Button", 730, 262, experience),
  child("Segmented", 730, 310, experience),
];

const lines: Segment[] = [
  { x1: 480, y1: 54, x2: 120, y2: 100 },
  { x1: 480, y1: 54, x2: 360, y2: 100 },
  { x1: 480, y1: 54, x2: 840, y2: 100 },
  { x1: 26, y1: 144, x2: 26, y2: 329 },
  { x1: 26, y1: 185, x2: 42, y2: 185 },
  { x1: 26, y1: 329, x2: 42, y2: 329 },
  { x1: 58, y1: 204, x2: 58, y2: 281 },
  { x1: 58, y1: 233, x2: 74, y2: 233 },
  { x1: 58, y1: 281, x2: 74, y2: 281 },
  { x1: 266, y1: 144, x2: 266, y2: 233 },
  { x1: 266, y1: 185, x2: 282, y2: 185 },
  { x1: 266, y1: 233, x2: 282, y2: 233 },
  { x1: 506, y1: 185, x2: 522, y2: 185 },
  { x1: 506, y1: 233, x2: 522, y2: 233 },
  { x1: 506, y1: 281, x2: 522, y2: 281 },
  { x1: 746, y1: 144, x2: 746, y2: 329 },
  { x1: 746, y1: 185, x2: 762, y2: 185 },
  { x1: 746, y1: 233, x2: 762, y2: 233 },
  { x1: 746, y1: 281, x2: 762, y2: 281 },
  { x1: 746, y1: 329, x2: 762, y2: 329 },
];

const thread: Segment[] = [
  { x1: 480, y1: 54, x2: 600, y2: 100 },
  { x1: 506, y1: 144, x2: 506, y2: 329 },
  { x1: 506, y1: 329, x2: 522, y2: 329 },
];

const pathOf = (s: Segment): string => `M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`;

/** "every node of the spec as a box colored by its level ... the path from the root through Engine to ComputerPlayer is drawn as the yellow thread" */
export function TreeFigure() {
  return (
    <svg
      viewBox="0 0 960 360"
      role="img"
      aria-label={label}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <g stroke="var(--color-border)" strokeWidth={2} fill="none">
        {lines.map((s) => (
          <path key={pathOf(s)} d={pathOf(s)} />
        ))}
      </g>
      <g
        stroke="var(--color-thread)"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      >
        {thread.map((s) => (
          <path key={pathOf(s)} d={pathOf(s)} />
        ))}
      </g>
      {boxes.map((b) => (
        <g key={b.name}>
          <rect
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            rx={10}
            fill={b.fill}
          />
          <text
            x={b.x + b.width / 2}
            y={b.y + (b.height === 44 ? 28 : 24)}
            textAnchor="middle"
            fontWeight={700}
            fontSize={b.fontSize}
            fill="var(--color-on-accent)"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {b.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
