import type { CSSProperties } from "react";
import { NODES, stateOf, statesIn } from "./walkthrough/walkthrough";
import type { NodeState, Walkthrough } from "./walkthrough/walkthrough";
import { WalkInset } from "./walk-inset";

type Box = { x: number; y: number; w: number };

type Look = { stroke: string; strokeWidth: number; dash?: string; fill: string; word: string };

const BOXES: Record<string, Box> = {
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

const BANDS: { y: number; label: string }[] = [
  { y: 224, label: "UiKit · library" },
  { y: 296, label: "BoardKit · library" },
  { y: 368, label: "Engine · library" },
];

const LOOKS: Record<NodeState, Look> = {
  fresh: { stroke: "var(--color-dot-green)", strokeWidth: 1.5, fill: "var(--color-code)", word: "var(--color-dot-green)" },
  stale: { stroke: "var(--color-dot-amber)", strokeWidth: 1.5, fill: "var(--color-code)", word: "var(--color-dot-amber)" },
  writing: { stroke: "var(--color-thread)", strokeWidth: 1.5, fill: "var(--color-code)", word: "var(--color-thread)" },
  compiling: { stroke: "var(--color-thread)", strokeWidth: 3, fill: "var(--color-code)", word: "var(--color-thread)" },
  contract: { stroke: "var(--color-dot-green)", strokeWidth: 1.5, dash: "1 2", fill: "var(--color-code)", word: "var(--color-thread)" },
  checking: { stroke: "var(--color-thread)", strokeWidth: 1.5, dash: "4 3", fill: "var(--color-code)", word: "var(--color-thread)" },
  rejected: { stroke: "var(--color-dot-red)", strokeWidth: 1.5, fill: "var(--color-code)", word: "var(--color-dot-red)" },
  stopped: { stroke: "var(--color-dot-red)", strokeWidth: 3, fill: "var(--color-code)", word: "var(--color-dot-red)" },
  skipped: { stroke: "var(--color-code-muted)", strokeWidth: 1.5, dash: "4 3", fill: "var(--color-code)", word: "var(--color-code-muted)" },
  unwritten: { stroke: "var(--color-code-muted)", strokeWidth: 1.5, dash: "2 3", fill: "none", word: "var(--color-code-muted)" },
  slice: { stroke: "var(--color-thread)", strokeWidth: 2, dash: "6 3", fill: "var(--color-code)", word: "var(--color-thread)" },
  written: { stroke: "var(--color-code-text)", strokeWidth: 1.5, fill: "var(--color-code)", word: "var(--color-code-text)" },
  adopted: { stroke: "var(--color-level-experience)", strokeWidth: 1.5, dash: "5 3", fill: "var(--color-code)", word: "var(--color-level-experience)" },
  proven: { stroke: "var(--color-pass)", strokeWidth: 3, fill: "var(--color-code)", word: "var(--color-dot-green)" },
};

const WORDS: Record<NodeState, string> = {
  fresh: "✓ fresh",
  stale: "stale",
  writing: "writing",
  compiling: "building",
  contract: "contract only",
  checking: "checking",
  rejected: "rejected",
  stopped: "STOP",
  skipped: "skipped",
  unwritten: "",
  slice: "the slice",
  written: "written",
  adopted: "adopted",
  proven: "✓ proven",
};

const MEANINGS: Record<NodeState, string> = {
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

const shapeStyle = (look: Look, strokeWidth: number): CSSProperties => ({
  stroke: look.stroke,
  strokeWidth,
  strokeDasharray: look.dash,
  fill: look.fill,
});

/** "the walkthrough's picture title, then the 16 compiled Tic-Tac-Toe nodes as boxes" */
export function WalkPicture({ walkthrough, chapter }: { walkthrough: Walkthrough; chapter: number }) {
  const states = NODES.map((name) => ({ name, state: stateOf(walkthrough, chapter, name) }));
  const label = `${walkthrough.picture}: ${states
    .map(({ name, state }) => `${name}: ${MEANINGS[state]}`)
    .join("; ")}`;

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
        <div style={{ minWidth: 0 }}>
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
              {BANDS.map((band) => (
                <g key={band.label}>
                  <rect
                    x={0}
                    y={band.y}
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
                    y={band.y + 15}
                    fontSize={10}
                    style={{ fontFamily: "var(--font-mono)", fill: "var(--color-code-muted)" }}
                  >
                    {band.label}
                  </text>
                </g>
              ))}
            </g>
            {states.map(({ name, state }) => {
              const box = BOXES[name];
              const look = LOOKS[state];
              const centre = box.x + box.w / 2;
              const unwritten = state === "unwritten";
              return (
                <g key={name} data-node={name} data-state={state}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={36}
                    rx={6}
                    style={shapeStyle(look, look.strokeWidth)}
                  />
                  <text
                    x={centre}
                    y={unwritten ? box.y + 22 : box.y + 15}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={600}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fill: unwritten ? "var(--color-code-muted)" : "var(--color-code-text)",
                    }}
                  >
                    {name}
                  </text>
                  {unwritten ? null : (
                    <text
                      x={centre}
                      y={box.y + 29}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      style={{ fontFamily: "var(--font-sans)", fill: look.word }}
                    >
                      {WORDS[state]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <WalkInset inset={walkthrough.beats[chapter].inset} />
        </div>
      </div>
      <ul
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
        {statesIn(walkthrough).map((state) => (
          <li
            key={state}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 12"
              style={{ width: "16px", height: "12px" }}
            >
              <rect
                x={1}
                y={1}
                width={14}
                height={10}
                rx={2}
                style={shapeStyle(LOOKS[state], 1.5)}
              />
            </svg>
            {MEANINGS[state]}
          </li>
        ))}
      </ul>
    </div>
  );
}
