import type { ReactElement } from "react";

export type MiniBoardProps = {
  x: number;
  y: number;
  cell: number;
  marks: string;
  highlight?: number[];
  numbers?: boolean;
};

const squares: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** draws a 3 by 3 board inside a larger picture, at the position and size it is given */
export function MiniBoard({
  x,
  y,
  cell,
  marks,
  highlight,
  numbers,
}: MiniBoardProps): ReactElement {
  const lit: number[] = highlight ?? [];
  return (
    <g>
      {squares.map((i) => (
        <rect
          key={`square-${i}`}
          x={x + (i % 3) * cell}
          y={y + Math.floor(i / 3) * cell}
          width={cell}
          height={cell}
          fill={lit.includes(i) ? "var(--color-thread)" : "var(--color-surface)"}
          stroke="var(--color-border)"
          strokeWidth={1.5}
        />
      ))}
      {squares.map((i) => {
        const cx = x + (i % 3) * cell + cell / 2;
        const cy = y + Math.floor(i / 3) * cell + cell / 2;
        const mark = marks.charAt(i);
        if (mark === "X" || mark === "O") {
          return (
            <text
              key={`mark-${i}`}
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
          );
        }
        if (numbers === true) {
          return (
            <text
              key={`number-${i}`}
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
          );
        }
        return null;
      })}
    </g>
  );
}
