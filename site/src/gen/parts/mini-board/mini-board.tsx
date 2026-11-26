type MiniBoardProps = {
  x: number;
  y: number;
  cell: number;
  marks: string;
  highlight?: number[];
  numbers?: boolean;
};

/** draws a 3 by 3 board inside a larger picture, at the position and size it is given */
export function MiniBoard({
  x,
  y,
  cell,
  marks,
  highlight = [],
  numbers = false,
}: MiniBoardProps) {
  const squares = Array.from({ length: 9 }, (_, index) => index);
  return (
    <g>
      {squares.map((index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const left = x + column * cell;
        const top = y + row * cell;
        const centerX = left + cell / 2;
        const centerY = top + cell / 2;
        const mark = marks.charAt(index);
        const lit = highlight.includes(index);
        return (
          <g key={index}>
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
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-sans)"
                fontWeight={800}
                fontSize={cell * 0.62}
                fill={
                  mark === "X"
                    ? "var(--color-player-x)"
                    : "var(--color-player-o)"
                }
              >
                {mark}
              </text>
            ) : numbers ? (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={cell * 0.36}
                fill="var(--color-text-muted)"
              >
                {index}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
