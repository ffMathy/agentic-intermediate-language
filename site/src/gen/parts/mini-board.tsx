export type MiniBoardProps = {
  x: number;
  y: number;
  cell: number;
  marks: string;
  highlight?: number[];
  numbers?: boolean;
};

/** "draws a 3 by 3 board inside a larger picture, at the position and size it is given" */
export function MiniBoard({ x, y, cell, marks, highlight = [], numbers = false }: MiniBoardProps) {
  const squares = Array.from({ length: 9 }, (_, i) => i);
  return (
    <g>
      {squares.map((i) => {
        const column = i % 3;
        const row = Math.floor(i / 3);
        const left = x + column * cell;
        const top = y + row * cell;
        const cx = left + cell / 2;
        const cy = top + cell / 2;
        const mark = marks.charAt(i);
        const lit = highlight.includes(i);
        return (
          <g key={i}>
            <rect
              x={left}
              y={top}
              width={cell}
              height={cell}
              fill={lit ? "var(--color-thread)" : "var(--color-surface)"}
              stroke="var(--color-border)"
              strokeWidth={1.5}
            />
            {mark === "X" || mark === "O" ? (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-sans)"
                fontWeight={800}
                fontSize={cell * 0.62}
                fill={mark === "X" ? "var(--color-player-x)" : "var(--color-player-o)"}
              >
                {mark}
              </text>
            ) : numbers ? (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={cell * 0.36}
                fill="var(--color-text-muted)"
              >
                {String(i)}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
