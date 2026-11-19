// ail-derived-from: HomePage@9f993d44fbed12d9
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

function text(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

test("one story, in order", () => {
  render(<HomePage />);
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s.length).toBe(1);
  expect(text(h1s[0])).toBe("Write one sentence. Watch it become working software.");
  const h2s = screen.getAllByRole("heading", { level: 2 }).map(text);
  expect(h2s).toEqual([
    "Between a prompt and the code, there is nothing to review.",
    "A tree of tasks, the same all the way down",
    "Follow one sentence all the way down",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Browse the specs",
    "Start in two minutes",
  ]);
});

test("every top bar link has a place to land", () => {
  render(<HomePage />);
  for (const id of ["tree", "journey", "readers", "loop", "specs", "start"]) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});
