// ail-derived-from: PlayAGame@ae1205d1ccdfa5c9
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PlayAGame } from "../src/gen/play-a-game";

afterEach(cleanup);

const squares = () => screen.getAllByRole("button", { name: /^Row \d, column \d, / });
const square = (index: number) => squares()[index]!;
const pick = (...indices: number[]) => indices.forEach((i) => fireEvent.click(square(i)));
const status = () => document.querySelector('[aria-live="polite"]')!.textContent;
const content = (index: number) => square(index).getAttribute("aria-label")!.split(", ")[2];

test("X always starts", () => {
  render(<PlayAGame />);
  expect(status()).toBe("X's turn");
});

test("taking turns", () => {
  render(<PlayAGame />);
  pick(4);
  expect(content(4)).toBe("X");
  expect(status()).toBe("O's turn");
});

test("a taken square can't be picked", () => {
  render(<PlayAGame />);
  pick(4, 4);
  expect(content(4)).toBe("X");
  expect(squares().filter((s) => !s.getAttribute("aria-label")!.endsWith("empty"))).toHaveLength(1);
  expect(status()).toBe("O's turn");
});

test("winning", () => {
  render(<PlayAGame />);
  pick(0, 4, 1, 6, 2);
  expect(status()).toBe("X wins!");
  const highlighted = squares().map((s, i) => (s.style.background.includes("--color-highlight") ? i : -1)).filter((i) => i >= 0);
  expect(highlighted).toEqual([0, 1, 2]);
  expect(squares().every((s) => (s as HTMLButtonElement).disabled)).toBe(true);
});

test("draw", () => {
  render(<PlayAGame />);
  pick(0, 1, 2, 4, 3, 5, 7, 6, 8);
  expect(status()).toBe("It's a draw");
});

test("new game", () => {
  render(<PlayAGame />);
  pick(0, 4, 1, 6, 2);
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  expect(squares().every((s) => s.getAttribute("aria-label")!.endsWith("empty"))).toBe(true);
  expect(status()).toBe("X's turn");
});

test("the computer answers", async () => {
  render(<PlayAGame />);
  fireEvent.click(screen.getByRole("radio", { name: "Computer" }));
  pick(0);
  expect(status()).toBe("O's turn");
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });
  expect(squares().filter((s) => s.getAttribute("aria-label")!.endsWith("O"))).toHaveLength(1);
  expect(status()).toBe("X's turn");
});
