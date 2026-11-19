import { Fragment } from "react";

type MiniBoardProps = {
  x: number;
  y: number;
  cell: number;
  marks: string;
  highlight?: number[];
  numbers?: boolean;
};

/** draws a 3 by 3 board inside a larger picture, at the position and size it is given */
export function MiniBoard({ x, y, cell, marks, highlight = [], numbers = false }: MiniBoardProps) {
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
          <Fragment key={index}>
            <rect
              x={left}
              y={top}
              width={cell}
              height={cell}
              style={{
                fill: lit ? "var(--color-thread)" : "var(--color-surface)",
                stroke: "var(--color-border)",
                strokeWidth: 1.5,
              }}
            />
            {mark === "X" || mark === "O" ? (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={cell * 0.62}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fill: mark === "X" ? "var(--color-player-x)" : "var(--color-player-o)",
                }}
              >
                {mark}
              </text>
            ) : numbers ? (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={cell * 0.36}
                style={{
                  fontFamily: "var(--font-mono)",
                  fill: "var(--color-text-muted)",
                }}
              >
                {String(index)}
              </text>
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}
