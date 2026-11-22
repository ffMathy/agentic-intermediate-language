// ail-derived-from: HomePage@818ad1bc30f137e9
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

const textOf = (element: HTMLElement): string =>
  (element.textContent ?? "").replace(/\s+/g, " ").trim();

test("one story, in order", () => {
  render(<HomePage />);
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s.map(textOf)).toEqual([
    "Write one sentence. Watch it become working software.",
  ]);
  const h2s = screen.getAllByRole("heading", { level: 2 });
  expect(h2s.map(textOf)).toEqual([
    "Between a prompt and the code, there is nothing to review.",
    "A tree of tasks, the same all the way down",
    "Follow one sentence all the way down",
    "Watch AIL build, and adopt",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Already have an app? Adopt it.",
    "Browse the specs",
    "Start in two minutes",
  ]);
});

test("every top bar link has a place to land", () => {
  const { container } = render(<HomePage />);
  for (const id of [
    "tree",
    "journey",
    "watch",
    "readers",
    "loop",
    "adopt",
    "specs",
    "start",
  ]) {
    expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
  }
});
