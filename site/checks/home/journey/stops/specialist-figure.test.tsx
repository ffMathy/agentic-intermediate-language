// ail-derived-from: SpecialistFigure@a868c97a00ac26ef
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecialistFigure } from "../../../../src/gen/home/journey/stops/specialist-figure";

afterEach(() => {
  cleanup();
});

function hasElementWithText(container: Element, text: string): boolean {
  return Array.from(container.querySelectorAll("*")).some(
    (el) => (el.textContent ?? "").trim() === text,
  );
}

test("the picture", () => {
  render(<SpecialistFigure />);
  const image = screen.getByRole("img", {
    name: "A tree of possible games: every ending is an O win or a draw, never an X win",
  });
  expect(image).toBeTruthy();
  expect(hasElementWithText(image, "O wins")).toBe(true);
  expect(hasElementWithText(image, "draw")).toBe(true);
  expect(hasElementWithText(image, "X wins: never")).toBe(true);
});
