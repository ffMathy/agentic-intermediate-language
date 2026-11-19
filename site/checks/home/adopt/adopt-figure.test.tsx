// ail-derived-from: AdoptFigure@bf5831c56b2a4a29
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { AdoptFigure } from "../../../src/gen/home/adopt/adopt-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<AdoptFigure />);
  const image = screen.getByRole("img", {
    name: "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both",
  });
  expect(image).toBeTruthy();
  const text = image.textContent ?? "";
  expect(text).toContain("Your app today");
  expect(text).toContain("AIL spec");
  expect(text).toContain("Your app, rebuilt");
});
