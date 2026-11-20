// ail-derived-from: HomePage@96f3617b79a08e4f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

const textOf = (element: Element): string =>
  (element.textContent ?? "").replace(/\s+/g, " ").trim();

test("one story, in order", () => {
  render(<HomePage />);

  const h1 = screen.getByRole("heading", { level: 1 });
  expect(textOf(h1)).toBe("Write one sentence. Watch it become working software.");

  const h2s = screen.getAllByRole("heading", { level: 2 }).map(textOf);
  expect(h2s).toEqual([
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
  render(<HomePage />);

  for (const id of ["tree", "journey", "readers", "loop", "adopt", "specs", "start"]) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});
