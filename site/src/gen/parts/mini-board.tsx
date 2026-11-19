import { Fragment } from "react";

/** binds props: x: number, y: number, cell: number, marks: string, highlight?: number[], numbers?: boolean */
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
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
        const lit = highlight !== undefined && highlight.includes(i);
        return (
          <Fragment key={i}>
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
            ) : numbers === true ? (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={cell * 0.36}
                fill="var(--color-text-muted)"
              >
                {i}
              </text>
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}
