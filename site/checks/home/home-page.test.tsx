// ail-derived-from: HomePage@ff37c01b3c932156
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

const textOf = (el: Element): string =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim();

test("one story, in order", () => {
  render(<HomePage />);
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s.map(textOf)).toEqual([
    "Write one sentence. Watch it become working software.",
  ]);
  const h2s = screen.getAllByRole("heading", { level: 2 });
  expect(h2s.map(textOf)).toEqual([
    "Between a prompt and the code, there was nothing to review.",
    "Follow one sentence all the way down",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Start in two minutes",
  ]);
});

test("every top bar link has a place to land", () => {
  render(<HomePage />);
  for (const id of ["journey", "readers", "loop", "start"]) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});
