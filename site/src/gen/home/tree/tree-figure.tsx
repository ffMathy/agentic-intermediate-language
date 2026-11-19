const LINES: [number, number, number, number][] = [
  [480, 54, 120, 120],
  [480, 54, 360, 120],
  [480, 54, 600, 120],
  [480, 54, 840, 120],
  [600, 164, 375, 250],
  [600, 164, 540, 250],
  [600, 164, 705, 250],
  [600, 164, 870, 250],
];

const THREAD: [number, number, number, number][] = [
  [480, 54, 600, 120],
  [600, 164, 870, 250],
];

type Box = {
  name: string;
  x: number;
  y: number;
  width: number;
  fill: string;
};

const BOXES: Box[] = [
  { name: "TicTacToe", x: 400, y: 10, width: 160, fill: "var(--color-level-product)" },
  { name: "App", x: 40, y: 120, width: 160, fill: "var(--color-level-experience)" },
  { name: "BoardKit", x: 280, y: 120, width: 160, fill: "var(--color-level-experience)" },
  { name: "Engine", x: 520, y: 120, width: 160, fill: "var(--color-level-system)" },
  { name: "UiKit", x: 760, y: 120, width: 160, fill: "var(--color-level-experience)" },
  { name: "GameState", x: 300, y: 250, width: 150, fill: "var(--color-level-system)" },
  { name: "Rules", x: 465, y: 250, width: 150, fill: "var(--color-level-system)" },
  { name: "GameReducer", x: 630, y: 250, width: 150, fill: "var(--color-level-system)" },
  { name: "ComputerPlayer", x: 795, y: 250, width: 150, fill: "var(--color-level-specialist)" },
];

const OTHERS: { x: number; text: string }[] = [
  { x: 120, text: "PlayAGame · WatchADemo" },
  { x: 360, text: "BoardView · StatusLine" },
  { x: 840, text: "Stack · Text · Button · Segmented" },
];

/** the root, its four children, the children of Engine, and the names of the other children, joined by lines; the path from the root through Engine to ComputerPlayer is drawn as the yellow thread */
export function TreeFigure() {
  return (
    <svg
      viewBox="0 0 960 310"
      role="img"
      aria-label="The Tic-Tac-Toe spec as a tree: TicTacToe, its four children, and the four children of Engine, with the path down to ComputerPlayer highlighted"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {LINES.map(([x1, y1, x2, y2]) => (
        <line
          key={`line-${x1}-${y1}-${x2}-${y2}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={2}
          style={{ stroke: "var(--color-border)" }}
        />
      ))}
      {THREAD.map(([x1, y1, x2, y2]) => (
        <line
          key={`thread-${x1}-${y1}-${x2}-${y2}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={5}
          strokeLinecap="round"
          style={{ stroke: "var(--color-thread)" }}
        />
      ))}
      {BOXES.map((box) => (
        <g key={box.name}>
          <rect
            x={box.x}
            y={box.y}
            width={box.width}
            height={44}
            rx={10}
            style={{ fill: box.fill }}
          />
          <text
            x={box.x + box.width / 2}
            y={box.y + 28}
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
          >
            {box.name}
          </text>
        </g>
      ))}
      {OTHERS.map((other) => (
        <text
          key={other.text}
          x={other.x}
          y={192}
          textAnchor="middle"
          fontSize={13}
          style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {other.text}
        </text>
      ))}
    </svg>
  );
}
