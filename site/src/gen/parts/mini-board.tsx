export type MiniBoardProps = {
  x: number;
  y: number;
  cell: number;
  marks: string;
  highlight?: number[];
  numbers?: boolean;
};

/** draws a 3 by 3 board inside a larger picture, at the position and size it is given */
export function MiniBoard({ x, y, cell, marks, highlight, numbers }: MiniBoardProps) {
  const lit = highlight ?? [];
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <g>
      {squares.map((i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <rect
            key={`r${i}`}
            x={x + col * cell}
            y={y + row * cell}
            width={cell}
            height={cell}
            style={{
              fill: lit.includes(i) ? "var(--color-thread)" : "var(--color-surface)",
              stroke: "var(--color-border)",
              strokeWidth: 1.5,
            }}
          />
        );
      })}
      {squares.map((i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const cx = x + col * cell + cell / 2;
        const cy = y + row * cell + cell / 2;
        const mark = marks.charAt(i);
        if (mark === "X" || mark === "O") {
          return (
            <text
              key={`t${i}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: cell * 0.62,
                fill: mark === "X" ? "var(--color-player-x)" : "var(--color-player-o)",
              }}
            >
              {mark}
            </text>
          );
        }
        if (numbers) {
          return (
            <text
              key={`t${i}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: cell * 0.36,
                fill: "var(--color-text-muted)",
              }}
            >
              {String(i)}
            </text>
          );
        }
        return null;
      })}
    </g>
  );
}
