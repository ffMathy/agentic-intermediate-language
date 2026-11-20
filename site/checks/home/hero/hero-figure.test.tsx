// ail-derived-from: HeroFigure@e848238df1d67e0d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HeroFigure } from "../../../src/gen/home/hero/hero-figure";

afterEach(() => {
  cleanup();
});

test("the picture is described", () => {
  render(<HeroFigure />);
  const picture = screen.getByRole("img", {
    name: "One sentence sinks through four levels of spec and comes out as code and a game board",
  });
  expect(picture).toBeTruthy();
  const texts = Array.from(picture.querySelectorAll("text")).map((el) =>
    (el.textContent ?? "").trim(),
  );
  for (const expected of [
    "Tic-Tac-Toe.",
    "The computer never loses.",
    "Product",
    "Experience",
    "System",
    "Specialist",
  ]) {
    expect(texts).toContain(expected);
  }
});
