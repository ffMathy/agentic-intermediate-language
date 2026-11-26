type Box = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  fontSize: number;
};

type Segment = [number, number, number, number];

type Row = {
  name: string;
  x: number;
  fill: string;
  parent: number | null;
};

const product = "var(--color-level-product)";
const experience = "var(--color-level-experience)";
const system = "var(--color-level-system)";
const specialist = "var(--color-level-specialist)";

const label =
  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted";

function child(name: string, columnX: number, y: number, fill: string): Box {
  return { name, x: columnX + 32, y, width: 188, height: 38, fill, fontSize: 13 };
}

const boxes: Box[] = [
  { name: "TicTacToe", x: 380, y: 10, width: 200, height: 44, fill: product, fontSize: 16 },
  { name: "App", x: 10, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  { name: "BoardKit", x: 250, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  { name: "Engine", x: 490, y: 100, width: 220, height: 44, fill: system, fontSize: 15 },
  { name: "UiKit", x: 730, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  child("PlayAGame", 10, 166, experience),
  { name: "NewGameButton", x: 74, y: 214, width: 156, height: 38, fill: experience, fontSize: 13 },
  { name: "ChooseOpponent", x: 74, y: 262, width: 156, height: 38, fill: experience, fontSize: 13 },
  child("WatchADemo", 10, 310, experience),
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
  [480, 54, 120, 100],
  [480, 54, 360, 100],
  [480, 54, 840, 100],
  [26, 144, 26, 329],
  [26, 185, 42, 185],
  [26, 329, 42, 329],
  [58, 204, 58, 281],
  [58, 233, 74, 233],
  [58, 281, 74, 281],
  [266, 144, 266, 233],
  [266, 185, 282, 185],
  [266, 233, 282, 233],
  [506, 185, 522, 185],
  [506, 233, 522, 233],
  [506, 281, 522, 281],
  [746, 144, 746, 329],
  [746, 185, 762, 185],
  [746, 233, 762, 233],
  [746, 281, 762, 281],
  [746, 329, 762, 329],
];

const thread: Segment[] = [
  [480, 54, 600, 100],
  [506, 144, 506, 329],
  [506, 329, 522, 329],
];

const rows: Row[] = [
  { name: "TicTacToe", x: 4, fill: product, parent: null },
  { name: "App", x: 28, fill: experience, parent: 0 },
  { name: "PlayAGame", x: 52, fill: experience, parent: 1 },
  { name: "NewGameButton", x: 76, fill: experience, parent: 2 },
  { name: "ChooseOpponent", x: 76, fill: experience, parent: 2 },
  { name: "WatchADemo", x: 52, fill: experience, parent: 1 },
  { name: "BoardKit", x: 28, fill: experience, parent: 0 },
  { name: "BoardView", x: 52, fill: experience, parent: 6 },
  { name: "StatusLine", x: 52, fill: experience, parent: 6 },
  { name: "Engine", x: 28, fill: system, parent: 0 },
  { name: "GameState", x: 52, fill: system, parent: 9 },
  { name: "Rules", x: 52, fill: system, parent: 9 },
  { name: "GameReducer", x: 52, fill: system, parent: 9 },
  { name: "ComputerPlayer", x: 52, fill: specialist, parent: 9 },
  { name: "UiKit", x: 28, fill: experience, parent: 0 },
  { name: "Stack", x: 52, fill: experience, parent: 14 },
  { name: "Text", x: 52, fill: experience, parent: 14 },
  { name: "Button", x: 52, fill: experience, parent: 14 },
  { name: "Segmented", x: 52, fill: experience, parent: 14 },
];

function rowY(index: number): number {
  return 4 + 28 * index;
}

const outlineLines: Segment[] = rows.flatMap((row, index): Segment[] => {
  if (row.parent === null) {
    return [];
  }
  const parent = rows[row.parent];
  const lineX = parent.x + 10;
  const top = rowY(row.parent) + 22;
  const centre = rowY(index) + 11;
  return [
    [lineX, top, lineX, centre],
    [lineX, centre, row.x, centre],
  ];
});

const outlineThread: Segment[] = [
  [14, 26, 14, 267],
  [14, 267, 28, 267],
  [38, 278, 38, 379],
  [38, 379, 52, 379],
];

/** "every node of the spec as a box colored by its level ... below 600px viewport width the same tree is drawn as an indented outline" */
export function TreeFigure() {
  return (
    <>
      <svg
        className="ail-wide"
        role="img"
        aria-label={label}
        viewBox="0 0 960 360"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {lines.map(([x1, y1, x2, y2], index) => (
          <line
            key={`line-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={{ stroke: "var(--color-border)", strokeWidth: 2, fill: "none" }}
          />
        ))}
        {thread.map(([x1, y1, x2, y2], index) => (
          <line
            key={`thread-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={{
              stroke: "var(--color-thread)",
              strokeWidth: 5,
              strokeLinecap: "round",
              fill: "none",
            }}
          />
        ))}
        {boxes.map((box) => (
          <g key={box.name}>
            <rect
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx={10}
              style={{ fill: box.fill }}
            />
            <text
              x={box.x + box.width / 2}
              y={box.y + (box.height === 44 ? 28 : 24)}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: box.fontSize,
                fontWeight: 700,
                fill: "var(--color-on-accent)",
              }}
            >
              {box.name}
            </text>
          </g>
        ))}
      </svg>
      <svg
        className="ail-narrow"
        role="img"
        aria-label={label}
        viewBox="0 0 300 534"
        style={{ width: "100%", maxWidth: "320px", height: "auto", margin: "0 auto" }}
      >
        {outlineLines.map(([x1, y1, x2, y2], index) => (
          <line
            key={`line-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={{ stroke: "var(--color-border)", strokeWidth: 1.5, fill: "none" }}
          />
        ))}
        {outlineThread.map(([x1, y1, x2, y2], index) => (
          <line
            key={`thread-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={{
              stroke: "var(--color-thread)",
              strokeWidth: 4,
              strokeLinecap: "round",
              fill: "none",
            }}
          />
        ))}
        {rows.map((row, index) => (
          <g key={row.name}>
            <rect
              x={row.x}
              y={rowY(index)}
              width={180}
              height={22}
              rx={6}
              style={{ fill: row.fill }}
            />
            <text
              x={row.x + 10}
              y={rowY(index) + 11}
              textAnchor="start"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 700,
                fill: "var(--color-on-accent)",
              }}
            >
              {row.name}
            </text>
          </g>
        ))}
      </svg>
    </>
  );
}
