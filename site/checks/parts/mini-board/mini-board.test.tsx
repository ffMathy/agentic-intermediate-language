// ail-derived-from: MiniBoard@9b626486fbf200b7
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { MiniBoard } from "../../../src/gen/parts/mini-board/mini-board";

afterEach(() => {
  cleanup();
});

function drawnTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("text"))
    .map((el) => (el.textContent ?? "").trim())
    .filter((t) => t.length > 0);
}

test("marks", () => {
  const { container } = render(
    <svg viewBox="0 0 90 90">
      <MiniBoard x={0} y={0} cell={30} marks="X___O____" />
    </svg>,
  );
  const marks = drawnTexts(container).filter((t) => t === "X" || t === "O");
  expect(marks.length).toBe(2);
  expect([...marks].sort()).toEqual(["O", "X"]);
});

test("numbers in empty squares", () => {
  const { container } = render(
    <svg viewBox="0 0 90 90">
      <MiniBoard x={0} y={0} cell={30} marks="XXXOO____" numbers={true} />
    </svg>,
  );
  const numbers = drawnTexts(container)
    .filter((t) => /^\d+$/.test(t))
    .map((t) => Number(t))
    .sort((a, b) => a - b);
  expect(numbers).toEqual([5, 6, 7, 8]);
});
