// ail-derived-from: HomePage@c0bcc58c692b533a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

const headingText = (element: HTMLElement): string =>
  (element.textContent ?? "").replace(/\s+/g, " ").trim();

test("one story, in order", () => {
  render(<HomePage />);

  const h1 = screen.getByRole("heading", { level: 1 });
  expect(headingText(h1)).toBe(
    "Write one sentence. Watch it become working software.",
  );

  const h2s = screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => headingText(heading));
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
  render(<HomePage />);

  const ids = [
    "tree",
    "journey",
    "watch",
    "readers",
    "loop",
    "review",
    "adopt",
    "specs",
    "start",
  ];
  for (const id of ids) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});
