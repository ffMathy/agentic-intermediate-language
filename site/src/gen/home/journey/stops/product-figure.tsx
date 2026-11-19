const rows = [
  { promise: "1 take turns", owner: "PlayAGame" },
  { promise: "2 win or draw", owner: "Rules" },
  { promise: "3 friend or computer", owner: "ChooseOpponent" },
  { promise: "4 never loses", owner: "ComputerPlayer" },
  { promise: "5 new game", owner: "NewGameButton" },
  { promise: "6 watch a demo", owner: "WatchADemo" },
];

/** six promises on the left, each joined to the node that keeps it on the right; promise 4 and its owner stand out, and their joining line moves */
export function ProductFigure() {
  return (
    <svg
      viewBox="0 0 360 256"
      role="img"
      aria-label="Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      {rows.map((row, i) => {
        const y = 8 + 38 * i;
        const four = i === 3;
        return (
          <g key={row.owner}>
            <line
              x1={158}
              y1={y + 14}
              x2={222}
              y2={y + 14}
              stroke={four ? "var(--color-thread-strong)" : "var(--color-border)"}
              strokeWidth={four ? 4 : 1}
              strokeDasharray={four ? "6 4" : undefined}
              style={four ? { animation: "ail-dash 1s linear infinite" } : undefined}
            />
            <rect
              x={8}
              y={y}
              width={150}
              height={28}
              rx={14}
              fill={four ? "var(--color-thread)" : "var(--color-surface)"}
              stroke={four ? "var(--color-thread-strong)" : "var(--color-border)"}
              strokeWidth={four ? 2 : 1}
            />
            <text
              x={22}
              y={y + 18}
              fontSize={12}
              fontFamily="var(--font-sans)"
              fontWeight={four ? 700 : undefined}
              fill="var(--color-text)"
            >
              {row.promise}
            </text>
            <rect
              x={222}
              y={y}
              width={130}
              height={28}
              rx={6}
              fill={four ? "var(--color-level-specialist)" : "var(--color-surface)"}
              stroke={four ? "none" : "var(--color-border)"}
              strokeWidth={four ? undefined : 1}
            />
            <text
              x={232}
              y={y + 18}
              fontSize={11}
              fontFamily="var(--font-mono)"
              fontWeight={four ? 700 : undefined}
              fill={four ? "var(--color-on-accent)" : "var(--color-text)"}
            >
              {row.owner}
            </text>
          </g>
        );
      })}
      <text
        x={180}
        y={250}
        textAnchor="middle"
        fontSize={12}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        every promise is refined-by the node that keeps it
      </text>
    </svg>
  );
}
