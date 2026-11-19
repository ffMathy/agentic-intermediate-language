// ail-derived-from: SpecialistFigure@2b931ae71cabc804
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecialistFigure } from "../../../../src/gen/home/journey/stops/specialist-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<SpecialistFigure />);
  const image = screen.getByRole("img", {
    name: "A tree of possible games: every ending is an O win or a draw, never an X win",
  });
  const text = image.textContent ?? "";
  expect(text).toContain("O wins");
  expect(text).toContain("draw");
  expect(text).toContain("X wins: never");
});
