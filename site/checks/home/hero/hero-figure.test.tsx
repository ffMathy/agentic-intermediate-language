// ail-derived-from: HeroFigure@4ff32fd5130d0f8f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HeroFigure } from "../../../src/gen/home/hero/hero-figure";

afterEach(() => {
  cleanup();
});

test("the picture is described", () => {
  render(<HeroFigure />);
  const image = screen.getByRole("img", {
    name: "One sentence sinks through four levels of spec and comes out as code and a game board",
  });
  expect(image).toBeTruthy();
  const text = image.textContent ?? "";
  for (const expected of [
    "Tic-Tac-Toe.",
    "The computer never loses.",
    "Product",
    "Experience",
    "System",
    "Specialist",
  ]) {
    expect(text).toContain(expected);
  }
});
