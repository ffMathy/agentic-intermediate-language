// ail-derived-from: WalkPicture@0924be5e3c368065
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkPicture } from "../../../src/gen/home/watch/walk-picture";
import { NODES } from "../../../src/gen/home/watch/walkthrough/walkthrough";
import type { Walkthrough } from "../../../src/gen/home/watch/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

function box(container: HTMLElement, name: string): Element {
  const el = container.querySelector(`[data-node="${name}"]`);
  if (el === null) {
    throw new Error(`no box for ${name}`);
  }
  return el;
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
        states: { WatchADemo: "stale", App: "stale" },
        inset: { kind: "none" },
      },
    ],
  };
  const { container } = render(<WalkPicture walkthrough={walkthrough} chapter={1} />);

  const meanings: Record<string, string> = { App: "out of date", WatchADemo: "out of date" };
  const nodes = NODES.map((name) => `${name}: ${meanings[name] ?? "up to date"}`).join("; ");
  const expectedName = `Tic-Tac-Toe spec · 16 nodes: ${nodes}`;
  expect(expectedName.startsWith("Tic-Tac-Toe spec · 16 nodes: TicTacToe: up to date; App: out of date; ")).toBe(true);
  expect(screen.getByRole("img", { name: expectedName })).toBeTruthy();

  expect(box(container, "WatchADemo").textContent).toContain("stale");
  expect(box(container, "App").textContent).toContain("stale");
  expect(box(container, "Rules").textContent).toContain("✓ fresh");
});

test("nodes with no spec yet", () => {
  const walkthrough: Walkthrough = {
    command: "ail adopt",
    place: "terminal",
    picture: "Tic-Tac-Toe spec · 16 nodes",
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

  expect(box(container, "PlayAGame").textContent).toContain("the slice");
  expect((box(container, "App").textContent ?? "").trim()).toBe("App");

  const items = screen.getAllByRole("listitem").map((li) => (li.textContent ?? "").trim());
  expect(items).toContain("no spec yet");
});
