// ail-derived-from: MiniBoard@71d260c17757168d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { MiniBoard } from "../../src/gen/parts/mini-board";

afterEach(() => {
  cleanup();
});

function drawnTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("svg text")).map((el) =>
    (el.textContent ?? "").trim(),
  );
}

test("marks", () => {
  const { container } = render(
    <svg viewBox="0 0 300 300">
      <MiniBoard x={0} y={0} cell={100} marks="X___O____" />
    </svg>,
  );
  const marks = drawnTexts(container).filter((t) => t === "X" || t === "O");
  expect(marks.length).toBe(2);
  expect([...marks].sort()).toEqual(["O", "X"]);
});

test("numbers in empty squares", () => {
  const { container } = render(
    <svg viewBox="0 0 300 300">
      <MiniBoard x={0} y={0} cell={100} marks="XXXOO____" numbers />
    </svg>,
  );
  const numbers = drawnTexts(container).filter((t) => /^\d+$/.test(t));
  expect([...numbers].sort()).toEqual(["5", "6", "7", "8"]);
});
