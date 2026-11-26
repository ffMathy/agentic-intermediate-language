// ail-derived-from: BoardView@46f4f5a14eb771e4
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BoardView } from "../../../src/gen/board/board-view/board-view";
import { boardFrom } from "../../../src/gen/engine/game-state/game-state";
import type { Status } from "../../../src/gen/engine/game-state/game-state";

afterEach(() => {
  cleanup();
});

const rowColumn = (index: number): { row: number; column: number } => ({
  row: Math.floor(index / 3) + 1,
  column: (index % 3) + 1,
});

const squareNamePattern = (index: number): RegExp => {
  const { row, column } = rowColumn(index);
  return new RegExp(`^Row ${row}, column ${column}, `);
};

const isHighlighted = (element: HTMLElement): boolean =>
  (element.getAttribute("style") ?? "").includes("var(--color-highlight)");

test("picking an empty square", () => {
  const onPlace = mock((_index: number) => {});
  const status: Status = { kind: "playing" };
  render(
    <BoardView
      board={boardFrom("___/___/___")}
      status={status}
      locked={false}
      onPlace={onPlace}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Row 2, column 2, empty" }));

  expect(onPlace).toHaveBeenCalledTimes(1);
  expect(onPlace).toHaveBeenCalledWith(4);
});

test("a taken square does nothing", () => {
  const onPlace = mock((_index: number) => {});
  const status: Status = { kind: "playing" };
  render(
    <BoardView
      board={boardFrom("___/_X_/___")}
      status={status}
      locked={false}
      onPlace={onPlace}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Row 2, column 2, X" }));

  expect(onPlace).not.toHaveBeenCalled();
});

test("the winning line stands out", () => {
  const onPlace = mock((_index: number) => {});
  const status: Status = { kind: "won", mark: "X", line: [0, 1, 2] };
  render(
    <BoardView
      board={boardFrom("XXX/OO_/___")}
      status={status}
      locked={false}
      onPlace={onPlace}
    />,
  );

  const squares = Array.from({ length: 9 }, (_, index) =>
    screen.getByRole("button", { name: squareNamePattern(index) }),
  );

  const highlighted = squares
    .map((square, index) => (isHighlighted(square) ? index : -1))
    .filter((index) => index >= 0);
  expect(highlighted).toEqual([0, 1, 2]);

  for (const square of squares) {
    expect((square as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(square);
  }
  expect(onPlace).not.toHaveBeenCalled();
});
