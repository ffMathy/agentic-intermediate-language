// ail-derived-from: TreeFigure@dbc948b121dde057
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { TreeFigure } from "../../../src/gen/home/tree/tree-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<TreeFigure />);
  const image = screen.getByRole("img", {
    name: "The Tic-Tac-Toe spec as a tree: TicTacToe, its four children, and the four children of Engine, with the path down to ComputerPlayer highlighted",
  });
  const text = image.textContent ?? "";
  expect(text).toContain("TicTacToe");
  expect(text).toContain("Engine");
  expect(text).toContain("ComputerPlayer");
});
