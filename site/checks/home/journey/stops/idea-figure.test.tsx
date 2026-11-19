// ail-derived-from: IdeaFigure@1933efd94946573d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { IdeaFigure } from "../../../../src/gen/home/journey/stops/idea-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<IdeaFigure />);
  const picture = screen.getByRole("img", {
    name: "A product owner says: The computer never loses.",
  });
  expect(picture).toBeTruthy();
});
