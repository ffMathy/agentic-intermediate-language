// ail-derived-from: HomePage@0262247e6a419947
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

function headingTexts(level: number): string[] {
  return screen
    .queryAllByRole("heading", { level })
    .map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
}

test("one story, in order", () => {
  render(<HomePage />);

  expect(headingTexts(1)).toEqual([
    "Write one sentence. Watch it become working software.",
  ]);

  expect(headingTexts(2)).toEqual([
    "Between a prompt and the code, there is nothing to review.",
    "A tree of tasks, the same all the way down",
    "Follow one sentence all the way down",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Already have an app? Adopt it.",
    "Browse the specs",
    "Start in two minutes",
  ]);
});

test("every top bar link has a place to land", () => {
  const { container } = render(<HomePage />);

  for (const id of ["tree", "journey", "readers", "loop", "adopt", "specs", "start"]) {
    expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
  }
});
