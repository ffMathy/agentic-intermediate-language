import type { CSSProperties } from "react";
import { NODES, stateOf, statesIn } from "../walkthrough/walkthrough";
import type { NodeState, Walkthrough } from "../walkthrough/walkthrough";
import { WalkInset } from "./walk-inset/walk-inset";

type StateLook = {
  stroke: string;
  width: number;
  dash?: string;
  fill: string;
  word?: string;
  wordColor?: string;
  meaning: string;
};

const STATES: Record<NodeState, StateLook> = {
  fresh: {
    stroke: "var(--color-dot-green)",
    width: 1.5,
    fill: "var(--color-code)",
    word: "✓ fresh",
    wordColor: "var(--color-dot-green)",
    meaning: "up to date",
  },
  stale: {
    stroke: "var(--color-dot-amber)",
    width: 1.5,
    fill: "var(--color-code)",
    word: "stale",
    wordColor: "var(--color-dot-amber)",
    meaning: "out of date",
  },
  writing: {
    stroke: "var(--color-thread)",
    width: 1.5,
    fill: "var(--color-code)",
    word: "writing",
    wordColor: "var(--color-thread)",
    meaning: "spec being written",
  },
  compiling: {
    stroke: "var(--color-thread)",
    width: 3,
    fill: "var(--color-code)",
    word: "building",
    wordColor: "var(--color-thread)",
    meaning: "being compiled",
  },
  contract: {
    stroke: "var(--color-dot-green)",
    width: 1.5,
    dash: "1 2",
    fill: "var(--color-code)",
    word: "contract only",
    wordColor: "var(--color-thread)",
    meaning: "only its contract is sent",
  },
  checking: {
    stroke: "var(--color-thread)",
    width: 1.5,
    dash: "4 3",
    fill: "var(--color-code)",
    word: "checking",
    wordColor: "var(--color-thread)",
    meaning: "being checked",
  },
  rejected: {
    stroke: "var(--color-dot-red)",
    width: 1.5,
    fill: "var(--color-code)",
    word: "rejected",
    wordColor: "var(--color-dot-red)",
    meaning: "attempt rejected",
  },
  stopped: {
    stroke: "var(--color-dot-red)",
    width: 3,
    fill: "var(--color-code)",
    word: "STOP",
    wordColor: "var(--color-dot-red)",
    meaning: "stopped with a question",
  },
  skipped: {
    stroke: "var(--color-code-muted)",
    width: 1.5,
    dash: "4 3",
    fill: "var(--color-code)",
    word: "skipped",
    wordColor: "var(--color-code-muted)",
    meaning: "waits for a node above it",
  },
  unwritten: {
    stroke: "var(--color-code-muted)",
    width: 1.5,
    dash: "2 3",
    fill: "none",
    meaning: "no spec yet",
  },
  slice: {
    stroke: "var(--color-thread)",
    width: 2,
    dash: "6 3",
    fill: "var(--color-code)",
    word: "the slice",
    wordColor: "var(--color-thread)",
    meaning: "the slice being adopted",
  },
  written: {
    stroke: "var(--color-code-text)",
    width: 1.5,
    fill: "var(--color-code)",
    word: "written",
    wordColor: "var(--color-code-text)",
    meaning: "spec written",
  },
  adopted: {
    stroke: "var(--color-level-experience)",
    width: 1.5,
    dash: "5 3",
    fill: "var(--color-code)",
    word: "adopted",
    wordColor: "var(--color-level-experience)",
    meaning: "adopted, not checked yet",
  },
  proven: {
    stroke: "var(--color-pass)",
    width: 3,
    fill: "var(--color-code)",
    word: "✓ proven",
    wordColor: "var(--color-dot-green)",
    meaning: "checked and proven",
  },
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

function borderStyle(dash: string | undefined): string {
  if (dash === undefined) {
    return "solid";
  }
  if (dash === "1 2" || dash === "2 3") {
    return "dotted";
  }
  return "dashed";
}

function shapeStyle(look: StateLook): CSSProperties {
  return {
    stroke: look.stroke,
    strokeWidth: look.width,
    strokeDasharray: look.dash,
    fill: look.fill,
  };
}

/** "the walkthrough's picture title, then the 16 compiled Tic-Tac-Toe nodes as boxes: the app and its screens as a tree on top, then the three libraries as bands with their nodes inside" */
export function WalkPicture({
  walkthrough,
  chapter,
}: {
  walkthrough: Walkthrough;
  chapter: number;
}) {
  const states = NODES.map((name) => ({
    name,
    state: stateOf(walkthrough, chapter, name),
  }));
  const label = `${walkthrough.picture}: ${states
    .map(({ name, state }) => `${name}: ${STATES[state].meaning}`)
    .join("; ")}`;
  const differing = states.filter(({ state }) => state !== walkthrough.rest);
  const left = NODES.length - differing.length;
  const restMeaning = STATES[walkthrough.rest].meaning;
  const restText =
    differing.length === 0
      ? `all ${16} nodes: ${restMeaning}`
      : `the other ${left} nodes: ${restMeaning}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-4)",
        height: "100%",
        boxSizing: "border-box",
        background: "var(--color-code-side)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-tiny)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-code-muted)",
        }}
      >
        {walkthrough.picture}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          alignItems: "stretch",
        }}
      >
        <div className="ail-wide" style={{ minWidth: 0 }}>
          <svg
            viewBox="0 0 480 436"
            role="img"
            aria-label={label}
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          >
            <g aria-hidden="true">
              {EDGES.map(([x1, y1, x2, y2]) => (
                <line
                  key={`${x1},${y1},${x2},${y2}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  style={{ stroke: "var(--color-code-muted)", strokeWidth: 1.5 }}
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
                    style={{
                      fill: "var(--color-code-bar)",
                      stroke: "var(--color-code-border)",
                      strokeWidth: 1,
                    }}
                  />
                  <text
                    x={10}
                    y={y + 15}
                    fontSize={10}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fill: "var(--color-code-muted)",
                    }}
                  >
                    {text}
                  </text>
                </g>
              ))}
            </g>
            {states.map(({ name, state }) => {
              const box = BOXES[name];
              const look = STATES[state];
              const cx = box.x + box.w / 2;
              return (
                <g key={name} data-node={name} data-state={state}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={36}
                    rx={6}
                    style={shapeStyle(look)}
                  />
                  <text
                    x={cx}
                    y={look.word === undefined ? box.y + 22 : box.y + 15}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={600}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fill:
                        look.word === undefined
                          ? "var(--color-code-muted)"
                          : "var(--color-code-text)",
                    }}
                  >
                    {name}
                  </text>
                  {look.word === undefined ? null : (
                    <text
                      x={cx}
                      y={box.y + 29}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fill: look.wordColor,
                      }}
                    >
                      {look.word}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="ail-narrow">
          <ul
            aria-label="Nodes this chapter touches"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            {differing.map(({ name, state }) => {
              const look = STATES[state];
              return (
                <li
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    padding: "var(--space-1) var(--space-2)",
                    borderRadius: "var(--radius-md)",
                    background: look.fill,
                    border: `${look.width}px ${borderStyle(look.dash)} ${look.stroke}`,
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--font-small)",
                    lineHeight: 1.4,
                    color: "var(--color-code-text)",
                  }}
                >
                  {look.word === undefined ? (
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--color-code-muted)",
                      }}
                    >
                      {name}
                    </span>
                  ) : (
                    <>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                      {" · "}
                      <span style={{ fontWeight: 700, color: look.wordColor }}>
                        {look.word}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {left === 0 ? null : (
            <p
              style={{
                margin: "var(--space-2) 0 0",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--font-small)",
                color: "var(--color-code-muted)",
              }}
            >
              {restText}
            </p>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <WalkInset inset={walkthrough.beats[chapter].inset} />
        </div>
      </div>
      <ul
        className="ail-wide"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-1) var(--space-4)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-muted)",
        }}
      >
        {statesIn(walkthrough).map((state) => {
          const look = STATES[state];
          return (
            <li
              key={state}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 12"
                width="16px"
                height="12px"
              >
                <rect
                  x={1}
                  y={1}
                  width={14}
                  height={10}
                  rx={2}
                  style={{
                    stroke: look.stroke,
                    strokeDasharray: look.dash,
                    fill: look.fill,
                    strokeWidth: 1.5,
                  }}
                />
              </svg>
              {look.meaning}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
