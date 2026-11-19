// ail-derived-from: IdeaFigure@a427dd64897872d2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { IdeaFigure } from "../../../../src/gen/home/journey/stops/idea-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<IdeaFigure />);
  const image = screen.getByRole("img", {
    name: "A product owner says: Tic-Tac-Toe. The computer never loses.",
  });
  expect(image).toBeTruthy();
});
