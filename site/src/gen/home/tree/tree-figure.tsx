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

const boxes: Box[] = [
  { name: "TicTacToe", x: 380, y: 10, width: 200, height: 44, fill: "var(--color-level-product)", fontSize: 16 },
  { name: "App", x: 10, y: 100, width: 220, height: 44, fill: "var(--color-level-experience)", fontSize: 15 },
  { name: "BoardKit", x: 250, y: 100, width: 220, height: 44, fill: "var(--color-level-experience)", fontSize: 15 },
  { name: "Engine", x: 490, y: 100, width: 220, height: 44, fill: "var(--color-level-system)", fontSize: 15 },
  { name: "UiKit", x: 730, y: 100, width: 220, height: 44, fill: "var(--color-level-experience)", fontSize: 15 },
  { name: "PlayAGame", x: 42, y: 166, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "NewGameButton", x: 74, y: 214, width: 156, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "ChooseOpponent", x: 74, y: 262, width: 156, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "WatchADemo", x: 42, y: 310, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "BoardView", x: 282, y: 166, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "StatusLine", x: 282, y: 214, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "GameState", x: 522, y: 166, width: 188, height: 38, fill: "var(--color-level-system)", fontSize: 13 },
  { name: "Rules", x: 522, y: 214, width: 188, height: 38, fill: "var(--color-level-system)", fontSize: 13 },
  { name: "GameReducer", x: 522, y: 262, width: 188, height: 38, fill: "var(--color-level-system)", fontSize: 13 },
  { name: "ComputerPlayer", x: 522, y: 310, width: 188, height: 38, fill: "var(--color-level-specialist)", fontSize: 13 },
  { name: "Stack", x: 762, y: 166, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "Text", x: 762, y: 214, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "Button", x: 762, y: 262, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
  { name: "Segmented", x: 762, y: 310, width: 188, height: 38, fill: "var(--color-level-experience)", fontSize: 13 },
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

/** every node of the spec as a box colored by its level, with lines to each parent and the path from the root through Engine to ComputerPlayer drawn as the yellow thread */
export function TreeFigure() {
  return (
    <svg
      viewBox="0 0 960 360"
      role="img"
      aria-label="The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <g style={{ stroke: "var(--color-border)", strokeWidth: 2, fill: "none" }}>
        {lines.map(([x1, y1, x2, y2]) => (
          <line key={`${x1},${y1},${x2},${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g
        style={{
          stroke: "var(--color-thread)",
          strokeWidth: 5,
          strokeLinecap: "round",
          fill: "none",
        }}
      >
        {thread.map(([x1, y1, x2, y2]) => (
          <line key={`${x1},${y1},${x2},${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
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
  );
}
