// ail-derived-from: BoardView@d36b81592304efcc
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BoardView } from "../../src/gen/board/board-view";

afterEach(() => {
  cleanup();
});

function isHighlighted(el: HTMLElement): boolean {
  const token = "var(--color-highlight)";
  return (
    el.style.backgroundColor === token ||
    el.style.background === token ||
    (el.getAttribute("style") ?? "").includes(token)
  );
}

test("picking an empty square", () => {
  const onPlace = mock((_index: number) => {});
  render(
    <BoardView
      board={[null, null, null, null, null, null, null, null, null]}
      status={{ kind: "playing" }}
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
  render(
    <BoardView
      board={[null, null, null, null, "X", null, null, null, null]}
      status={{ kind: "playing" }}
      locked={false}
      onPlace={onPlace}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Row 2, column 2, X" }));
  expect(onPlace).not.toHaveBeenCalled();
});

test("the winning line stands out", () => {
  const onPlace = mock((_index: number) => {});
  render(
    <BoardView
      board={["X", "X", "X", "O", "O", null, null, null, null]}
      status={{ kind: "won", mark: "X", line: [0, 1, 2] }}
      locked={false}
      onPlace={onPlace}
    />,
  );
  const names = [
    "Row 1, column 1, X",
    "Row 1, column 2, X",
    "Row 1, column 3, X",
    "Row 2, column 1, O",
    "Row 2, column 2, O",
    "Row 2, column 3, empty",
    "Row 3, column 1, empty",
    "Row 3, column 2, empty",
    "Row 3, column 3, empty",
  ];
  const squares = names.map((name) => screen.getByRole("button", { name }));
  squares.forEach((square, index) => {
    expect(isHighlighted(square)).toBe(index < 3);
  });
  for (const square of squares) {
    expect((square as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(square);
  }
  expect(onPlace).not.toHaveBeenCalled();
});
