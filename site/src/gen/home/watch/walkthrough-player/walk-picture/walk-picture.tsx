import type { CSSProperties } from "react";
import { NODES, stateOf, statesIn } from "../walkthrough/walkthrough";
import type { NodeState, Walkthrough } from "../walkthrough/walkthrough";
import { WalkInset } from "./walk-inset/walk-inset";

type Look = {
  stroke: string;
  width: number;
  dash: string | null;
  fill: string;
  word: string;
};

const LOOKS: Record<NodeState, Look> = {
  fresh: { stroke: "var(--color-dot-green)", width: 1.5, dash: null, fill: "var(--color-code)", word: "var(--color-dot-green)" },
  stale: { stroke: "var(--color-dot-amber)", width: 1.5, dash: null, fill: "var(--color-code)", word: "var(--color-dot-amber)" },
  writing: { stroke: "var(--color-thread)", width: 1.5, dash: null, fill: "var(--color-code)", word: "var(--color-thread)" },
  compiling: { stroke: "var(--color-thread)", width: 3, dash: null, fill: "var(--color-code)", word: "var(--color-thread)" },
  contract: { stroke: "var(--color-dot-green)", width: 1.5, dash: "1 2", fill: "var(--color-code)", word: "var(--color-thread)" },
  checking: { stroke: "var(--color-thread)", width: 1.5, dash: "4 3", fill: "var(--color-code)", word: "var(--color-thread)" },
  rejected: { stroke: "var(--color-dot-red)", width: 1.5, dash: null, fill: "var(--color-code)", word: "var(--color-dot-red)" },
  stopped: { stroke: "var(--color-dot-red)", width: 3, dash: null, fill: "var(--color-code)", word: "var(--color-dot-red)" },
  skipped: { stroke: "var(--color-code-muted)", width: 1.5, dash: "4 3", fill: "var(--color-code)", word: "var(--color-code-muted)" },
  unwritten: { stroke: "var(--color-code-muted)", width: 1.5, dash: "2 3", fill: "none", word: "var(--color-code-muted)" },
  slice: { stroke: "var(--color-thread)", width: 2, dash: "6 3", fill: "var(--color-code)", word: "var(--color-thread)" },
  written: { stroke: "var(--color-code-text)", width: 1.5, dash: null, fill: "var(--color-code)", word: "var(--color-code-text)" },
  adopted: { stroke: "var(--color-level-experience)", width: 1.5, dash: "5 3", fill: "var(--color-code)", word: "var(--color-level-experience)" },
  proven: { stroke: "var(--color-pass)", width: 3, dash: null, fill: "var(--color-code)", word: "var(--color-dot-green)" },
};

const WORDS: Record<NodeState, string | null> = {
  fresh: "✓ fresh",
  stale: "stale",
  writing: "writing",
  compiling: "building",
  contract: "contract only",
  checking: "checking",
  rejected: "rejected",
  stopped: "STOP",
  skipped: "skipped",
  unwritten: null,
  slice: "the slice",
  written: "written",
  adopted: "adopted",
  proven: "✓ proven",
};

const MEANS: Record<NodeState, string> = {
  fresh: "up to date",
  stale: "out of date",
  writing: "spec being written",
  compiling: "being compiled",
  contract: "only its contract is sent",
  checking: "being checked",
  rejected: "attempt rejected",
  stopped: "stopped with a question",
  skipped: "waits for a node above it",
  unwritten: "no spec yet",
  slice: "the slice being adopted",
  written: "spec written",
  adopted: "adopted, not checked yet",
  proven: "checked and proven",
};

const BOXES: Record<string, { x: number; y: number; w: number }> = {
  TicTacToe: { x: 170, y: 4, w: 140 },
  App: { x: 170, y: 60, w: 140 },
  PlayAGame: { x: 74, y: 116, w: 140 },
  WatchADemo: { x: 266, y: 116, w: 140 },
  ChooseOpponent: { x: 4, y: 172, w: 140 },
  NewGameButton: { x: 152, y: 172, w: 140 },
  Stack: { x: 10, y: 246, w: 108 },
  Text: { x: 126, y: 246, w: 108 },
  Button: { x: 242, y: 246, w: 108 },
  Segmented: { x: 358, y: 246, w: 112 },
  BoardView: { x: 10, y: 318, w: 140 },
  StatusLine: { x: 158, y: 318, w: 140 },
  GameState: { x: 10, y: 390, w: 108 },
  Rules: { x: 126, y: 390, w: 108 },
  GameReducer: { x: 242, y: 390, w: 108 },
  ComputerPlayer: { x: 358, y: 390, w: 112 },
};

const EDGES: [number, number, number, number][] = [
  [240, 40, 240, 60],
  [240, 96, 144, 116],
  [240, 96, 336, 116],
  [144, 152, 74, 172],
  [144, 152, 222, 172],
];

const BANDS: [number, string][] = [
  [224, "UiKit · library"],
  [296, "BoardKit · library"],
  [368, "Engine · library"],
];

const borderStyle = (dash: string | null): string => {
  if (dash === null) {
    return "solid";
  }
  if (dash === "1 2" || dash === "2 3") {
    return "dotted";
  }
  return "dashed";
};

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
  padding: "var(--space-4)",
  height: "100%",
  boxSizing: "border-box",
  background: "var(--color-code-side)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-tiny)",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-code-muted)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
  alignItems: "stretch",
};

const svgStyle: CSSProperties = {
  width: "100%",
  maxWidth: "480px",
  height: "auto",
  display: "block",
  margin: "0 auto",
};

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
};

const restStyle: CSSProperties = {
  margin: "var(--space-2) 0 0",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  color: "var(--color-code-muted)",
};

const legendStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-1) var(--space-4)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-code-muted)",
};

const legendItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-2)",
};

/** "the walkthrough's picture title, then the 16 compiled Tic-Tac-Toe nodes as boxes" */
export function WalkPicture({ walkthrough, chapter }: { walkthrough: Walkthrough; chapter: number }) {
  const states = NODES.map((name) => ({ name, state: stateOf(walkthrough, chapter, name) }));
  const label = `${walkthrough.picture}: ${states.map(({ name, state }) => `${name}: ${MEANS[state]}`).join("; ")}`;
  const chips = states.filter(({ state }) => state !== walkthrough.rest);
  const left = NODES.length - chips.length;
  const rest =
    chips.length === 0
      ? `all ${NODES.length} nodes: ${MEANS[walkthrough.rest]}`
      : `the other ${left} nodes: ${MEANS[walkthrough.rest]}`;
  return (
    <div style={rootStyle}>
      <p style={titleStyle}>{walkthrough.picture}</p>
      <div style={rowStyle}>
        <div className="ail-wide" style={{ minWidth: 0 }}>
          <svg viewBox="0 0 480 436" style={svgStyle} role="img" aria-label={label}>
            <g aria-hidden="true">
              {EDGES.map(([x1, y1, x2, y2]) => (
                <line
                  key={`${x1},${y1},${x2},${y2}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--color-code-muted)"
                  strokeWidth={1.5}
                />
              ))}
              {BANDS.map(([y, text]) => (
                <g key={text}>
                  <rect
                    x={0}
                    y={y}
                    width={480}
                    height={64}
                    rx={8}
                    fill="var(--color-code-bar)"
                    stroke="var(--color-code-border)"
                    strokeWidth={1}
                  />
                  <text x={10} y={y + 15} fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-code-muted)">
                    {text}
                  </text>
                </g>
              ))}
            </g>
            {states.map(({ name, state }) => {
              const box = BOXES[name];
              const look = LOOKS[state];
              const word = WORDS[state];
              const cx = box.x + box.w / 2;
              return (
                <g key={name} data-node={name} data-state={state}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={36}
                    rx={6}
                    fill={look.fill}
                    stroke={look.stroke}
                    strokeWidth={look.width}
                    strokeDasharray={look.dash ?? undefined}
                  />
                  <text
                    x={cx}
                    y={word === null ? box.y + 22 : box.y + 15}
                    textAnchor="middle"
                    fontFamily="var(--font-sans)"
                    fontSize={12}
                    fontWeight={600}
                    fill={word === null ? "var(--color-code-muted)" : "var(--color-code-text)"}
                  >
                    {name}
                  </text>
                  {word === null ? null : (
                    <text
                      x={cx}
                      y={box.y + 29}
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                      fontSize={10}
                      fontWeight={700}
                      fill={look.word}
                    >
                      {word}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="ail-narrow">
          <ul style={listStyle} aria-label="Nodes this chapter touches">
            {chips.map(({ name, state }) => {
              const look = LOOKS[state];
              const word = WORDS[state];
              return (
                <li
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    padding: "var(--space-1) var(--space-2)",
                    borderRadius: "var(--radius-md)",
                    background: state === "unwritten" ? "none" : "var(--color-code)",
                    border: `${look.width}px ${borderStyle(look.dash)} ${look.stroke}`,
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--font-small)",
                    lineHeight: 1.4,
                    color: "var(--color-code-text)",
                  }}
                >
                  {word === null ? (
                    <span style={{ fontWeight: 600, color: "var(--color-code-muted)" }}>{name}</span>
                  ) : (
                    <>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                      {" · "}
                      <span style={{ fontWeight: 700, color: look.word }}>{word}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {chips.length === NODES.length ? null : <p style={restStyle}>{rest}</p>}
        </div>
        <div style={{ minWidth: 0 }}>
          <WalkInset inset={walkthrough.beats[chapter].inset} />
        </div>
      </div>
      <ul className="ail-wide" style={legendStyle}>
        {statesIn(walkthrough).map((state) => {
          const look = LOOKS[state];
          return (
            <li key={state} style={legendItemStyle}>
              <svg aria-hidden="true" viewBox="0 0 16 12" width="16px" height="12px">
                <rect
                  x={1}
                  y={1}
                  width={14}
                  height={10}
                  rx={2}
                  fill={look.fill}
                  stroke={look.stroke}
                  strokeWidth={1.5}
                  strokeDasharray={look.dash ?? undefined}
                />
              </svg>
              {MEANS[state]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
