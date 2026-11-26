// ail-derived-from: IdeaFigure@6458b7fa320d4df3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { IdeaFigure } from "../../../../../../src/gen/home/journey/stops/stop-idea/idea-figure/idea-figure";

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
