// ail-derived-from: ExperienceFigure@f30376e9c28264d3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ExperienceFigure } from "../../../../src/gen/home/journey/stops/experience-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<ExperienceFigure />);
  const picture = screen.getByRole("img", {
    name: "Three frames: an empty board, X in the center, then O answers after 300 ms",
  });
  expect(picture).toBeTruthy();
  const text = picture.textContent ?? "";
  expect(text).toContain("Given: vs computer");
  expect(text).toContain("When: X picks");
  expect(text).toContain("Then: O answers");
  expect(text).toContain("300 ms");
});
