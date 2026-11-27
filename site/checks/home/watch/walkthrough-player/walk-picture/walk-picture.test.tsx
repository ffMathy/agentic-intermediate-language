// ail-derived-from: WalkPicture@7cc6f47c62d5f4ec
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkPicture } from "../../../../../src/gen/home/watch/walkthrough-player/walk-picture/walk-picture";
import type { Walkthrough } from "../../../../../src/gen/home/watch/walkthrough-player/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

const DRAWING_ORDER = [
  "TicTacToe",
  "App",
  "PlayAGame",
  "WatchADemo",
  "ChooseOpponent",
  "NewGameButton",
  "Stack",
  "Text",
  "Button",
  "Segmented",
  "BoardView",
  "StatusLine",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
];

function boxTexts(container: HTMLElement, name: string): string[] {
  const box = container.querySelector(`g[data-node="${name}"]`);
  expect(box).not.toBeNull();
  return Array.from(box?.querySelectorAll("text") ?? []).map((t) => (t.textContent ?? "").trim());
}

test("a stale chapter", () => {
  const walkthrough: Walkthrough = {
    command: "ail build",
    place: "terminal",
    picture: "Tic-Tac-Toe spec · 16 nodes",
    rest: "fresh",
    beats: [
      {
        id: "start",
        title: "Start",
        caption: "The build starts.",
        seconds: 5,
        branch: false,
        lines: ["$ ail build"],
        states: {},
        inset: { kind: "none" },
      },
      {
        id: "stale",
        title: "Stale",
        caption: "Two nodes are out of date.",
        seconds: 5,
        branch: false,
        lines: ["2 nodes stale"],
        states: { App: "stale", WatchADemo: "stale" },
        inset: { kind: "none" },
      },
    ],
  };
  const { container } = render(<WalkPicture walkthrough={walkthrough} chapter={1} />);

  const nodes = DRAWING_ORDER.map(
    (name) => `${name}: ${name === "App" || name === "WatchADemo" ? "out of date" : "up to date"}`,
  ).join("; ");
  const expectedName = `Tic-Tac-Toe spec · 16 nodes: ${nodes}`;
  expect(expectedName.startsWith("Tic-Tac-Toe spec · 16 nodes: TicTacToe: up to date; App: out of date; ")).toBe(true);
  expect(screen.getByRole("img", { name: expectedName })).toBeTruthy();

  expect(boxTexts(container, "WatchADemo")).toEqual(["WatchADemo", "stale"]);
  expect(boxTexts(container, "App")).toEqual(["App", "stale"]);
  expect(boxTexts(container, "Rules")).toEqual(["Rules", "✓ fresh"]);
});

test("nodes with no spec yet", () => {
  const walkthrough: Walkthrough = {
    command: "ail adopt",
    place: "terminal",
    picture: "Tic-Tac-Toe app · 16 nodes",
    rest: "unwritten",
    beats: [
      {
        id: "slice",
        title: "Pick a slice",
        caption: "Adoption starts with one slice.",
        seconds: 5,
        branch: false,
        lines: ["$ ail adopt"],
        states: { PlayAGame: "slice" },
        inset: { kind: "none" },
      },
    ],
  };
  const { container } = render(<WalkPicture walkthrough={walkthrough} chapter={0} />);

  expect(boxTexts(container, "PlayAGame")).toEqual(["PlayAGame", "the slice"]);
  expect(boxTexts(container, "App")).toEqual(["App"]);

  const items = screen.getAllByRole("listitem").map((li) => (li.textContent ?? "").trim());
  expect(items).toContain("no spec yet");
});
