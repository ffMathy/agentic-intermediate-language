const promises = [
  "1 take turns",
  "2 win or draw",
  "3 friend or computer",
  "4 never loses",
  "5 new game",
  "6 watch a demo",
];

const owners = [
  "PlayAGame",
  "Rules",
  "ChooseOpponent",
  "ComputerPlayer",
  "NewGameButton",
  "WatchADemo",
];

const keyRow = 3;

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
      {promises.map((promise, i) => {
        const y = 8 + 38 * i;
        const isKey = i === keyRow;
        return (
          <g key={promise}>
            <line
              x1={158}
              y1={y + 14}
              x2={222}
              y2={y + 14}
              style={
                isKey
                  ? {
                      stroke: "var(--color-thread-strong)",
                      strokeWidth: 4,
                      strokeDasharray: "6 4",
                      animation: "ail-dash 1s linear infinite",
                    }
                  : {
                      stroke: "var(--color-border)",
                      strokeWidth: 1,
                    }
              }
            />
            <rect
              x={8}
              y={y}
              width={150}
              height={28}
              rx={14}
              style={
                isKey
                  ? {
                      fill: "var(--color-thread)",
                      stroke: "var(--color-thread-strong)",
                      strokeWidth: 2,
                    }
                  : {
                      fill: "var(--color-surface)",
                      stroke: "var(--color-border)",
                      strokeWidth: 1,
                    }
              }
            />
            <text
              x={22}
              y={y + 18}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fill: "var(--color-text)",
                fontWeight: isKey ? 700 : undefined,
              }}
            >
              {promise}
            </text>
            <rect
              x={222}
              y={y}
              width={130}
              height={28}
              rx={6}
              style={
                isKey
                  ? {
                      fill: "var(--color-level-specialist)",
                      stroke: "none",
                    }
                  : {
                      fill: "var(--color-surface)",
                      stroke: "var(--color-border)",
                      strokeWidth: 1,
                    }
              }
            />
            <text
              x={232}
              y={y + 18}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fill: isKey ? "var(--color-on-accent)" : "var(--color-text)",
                fontWeight: isKey ? 700 : undefined,
              }}
            >
              {owners[i]}
            </text>
          </g>
        );
      })}
      <text
        x={180}
        y={250}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fill: "var(--color-text-muted)",
        }}
      >
        every promise is refined-by the node that keeps it
      </text>
    </svg>
  );
}
