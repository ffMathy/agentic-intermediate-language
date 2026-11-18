// ail-derived-from: BoardView@2e2306121a14c4c8
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BoardView } from "../src/gen/board-view";
import { boardFrom } from "../src/gen/game-state";

afterEach(cleanup);

const squares = () => screen.getAllByRole("button", { name: /^Row \d, column \d, / });

test("picking an empty square", () => {
  const onPlace = mock((_index: number) => {});
  render(<BoardView board={boardFrom("___/___/___")} status={{ kind: "playing" }} locked={false} onPlace={onPlace} />);
  expect(screen.getByRole("grid", { name: "Board" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Row 2, column 2, empty" }));
  expect(onPlace).toHaveBeenCalledTimes(1);
  expect(onPlace).toHaveBeenCalledWith(4);
});

test("a taken square does nothing", () => {
  const onPlace = mock((_index: number) => {});
  render(<BoardView board={boardFrom("___/_X_/___")} status={{ kind: "playing" }} locked={false} onPlace={onPlace} />);
  fireEvent.click(screen.getByRole("button", { name: "Row 2, column 2, X" }));
  expect(onPlace).not.toHaveBeenCalled();
});

test("the winning line stands out", () => {
  const onPlace = mock((_index: number) => {});
  render(<BoardView board={boardFrom("XXX/OO_/___")} status={{ kind: "won", mark: "X", line: [0, 1, 2] }} locked={false} onPlace={onPlace} />);
  const highlighted = squares().map((s, i) => (s.style.background.includes("--color-highlight") ? i : -1)).filter((i) => i >= 0);
  expect(highlighted).toEqual([0, 1, 2]);
  squares().forEach((s) => fireEvent.click(s));
  expect(onPlace).not.toHaveBeenCalled();
});
