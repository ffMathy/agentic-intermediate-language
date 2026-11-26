// ail-derived-from: HomePage@b0de874712c6a741
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

test("one story, in order", () => {
  render(<HomePage />);
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s.length).toBe(1);
  expect((h1s[0]?.textContent ?? "").trim()).toBe(
    "Write one sentence. Watch it become working software.",
  );
  const h2s = screen
    .getAllByRole("heading", { level: 2 })
    .map((h) => (h.textContent ?? "").trim());
  expect(h2s).toEqual([
    "Between a prompt and the code, there is nothing to review.",
    "A tree of tasks, the same all the way down",
    "Follow one sentence all the way down",
    "Watch AIL build, and adopt",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Review the spec and the screens. That's all.",
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
    "review",
    "adopt",
    "specs",
    "start",
  ]) {
    expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
  }
});
