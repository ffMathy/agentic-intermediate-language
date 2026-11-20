// ail-derived-from: TreeFigure@672eb8a1a8a19ee7
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { TreeFigure } from "../../../src/gen/home/tree/tree-figure";

afterEach(() => {
  cleanup();
});

const label =
  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted";

const names = [
  "TicTacToe",
  "App",
  "PlayAGame",
  "NewGameButton",
  "ChooseOpponent",
  "WatchADemo",
  "BoardKit",
  "BoardView",
  "StatusLine",
  "Engine",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
  "UiKit",
  "Stack",
  "Text",
  "Button",
  "Segmented",
];

test("the picture", () => {
  render(<TreeFigure />);
  const figure = screen.getByRole("img", { name: label });
  expect(figure).toBeTruthy();

  const leafTexts = new Set<string>();
  for (const el of Array.from(figure.querySelectorAll("*"))) {
    if (el.children.length === 0) {
      const text = (el.textContent ?? "").trim();
      if (text !== "") {
        leafTexts.add(text);
      }
    }
  }

  for (const name of names) {
    expect(leafTexts.has(name)).toBe(true);
  }
});
