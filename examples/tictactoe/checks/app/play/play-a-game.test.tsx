// ail-derived-from: PlayAGame@618142f73d1810c8
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PlayAGame } from "../../../src/gen/app/play/play-a-game";

afterEach(() => {
  cleanup();
});

function squares(): HTMLElement[] {
  const cells = within(screen.getByRole("grid")).getAllByRole("button");
  expect(cells.length).toBe(9);
  return cells;
}

function pick(index: number): void {
  fireEvent.click(squares()[index]);
}

function markOf(square: HTMLElement): string {
  return (square.textContent ?? "").trim();
}

function statusSays(text: string): HTMLElement {
  return screen.getByText((_content, element) => {
    if (!element || element.textContent !== text) return false;
    return Array.from(element.children).every((child) => child.textContent !== text);
  });
}

function chooseOpponent(name: string): void {
  for (const role of ["radio", "button", "tab", "menuitemradio"]) {
    const el = screen.queryByRole(role, { name });
    if (el) {
      fireEvent.click(el);
      return;
    }
  }
  const option = screen.queryByRole("option", { name }) as HTMLOptionElement | null;
  if (option) {
    const select = option.closest("select");
    if (select) {
      fireEvent.change(select, { target: { value: option.value } });
      return;
    }
    fireEvent.click(option);
    return;
  }
  throw new Error(`no control named "${name}"`);
}

test("X always starts", () => {
  render(<PlayAGame />);
  expect(statusSays("X's turn")).toBeTruthy();
});

test("taking turns", () => {
  render(<PlayAGame />);
  pick(4);
  expect(markOf(squares()[4])).toBe("X");
  expect(statusSays("O's turn")).toBeTruthy();
});

test("a taken square can't be picked", () => {
  render(<PlayAGame />);
  pick(4);
  const before = squares().map(markOf);
  pick(4);
  expect(squares().map(markOf)).toEqual(before);
  expect(markOf(squares()[4])).toBe("X");
  expect(statusSays("O's turn")).toBeTruthy();
});

test("winning", () => {
  render(<PlayAGame />);
  pick(0);
  pick(4);
  pick(1);
  pick(6);
  expect(statusSays("X's turn")).toBeTruthy();
  const topLeftBefore = squares()[0].outerHTML;
  const topMiddleBefore = squares()[1].outerHTML;
  const centerBefore = squares()[4].outerHTML;
  const bottomLeftBefore = squares()[6].outerHTML;

  pick(2);

  expect(statusSays("X wins!")).toBeTruthy();
  const after = squares();
  expect(markOf(after[2])).toBe("X");
  expect(after[0].outerHTML).not.toBe(topLeftBefore);
  expect(after[1].outerHTML).not.toBe(topMiddleBefore);
  expect(after[4].outerHTML).toBe(centerBefore);
  expect(after[6].outerHTML).toBe(bottomLeftBefore);

  for (const square of after) {
    expect((square as HTMLButtonElement).disabled).toBe(true);
  }
  const marks = after.map(markOf);
  pick(3);
  pick(8);
  expect(squares().map(markOf)).toEqual(marks);
  expect(statusSays("X wins!")).toBeTruthy();
});

test("draw", () => {
  render(<PlayAGame />);
  for (const index of [0, 1, 2, 4, 3, 5, 7, 6]) {
    pick(index);
  }
  pick(8);
  expect(statusSays("It's a draw")).toBeTruthy();
});

test("new game", () => {
  render(<PlayAGame />);
  for (const index of [0, 3, 1, 4, 2]) {
    pick(index);
  }
  expect(statusSays("X wins!")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  for (const square of squares()) {
    expect(["X", "O"]).not.toContain(markOf(square));
  }
  expect(statusSays("X's turn")).toBeTruthy();
});

test("the computer answers", async () => {
  render(<PlayAGame />);
  chooseOpponent("Computer");
  pick(4);
  expect(markOf(squares()[4])).toBe("X");
  await waitFor(
    () => {
      expect(squares().map(markOf).filter((m) => m === "O").length).toBe(1);
    },
    { timeout: 2000 },
  );
  expect(squares().map(markOf).filter((m) => m === "X").length).toBe(1);
  expect(statusSays("X's turn")).toBeTruthy();
});
