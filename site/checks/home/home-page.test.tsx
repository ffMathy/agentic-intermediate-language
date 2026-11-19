// ail-derived-from: HomePage@311511e46553b825
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

const normalize = (text: string | null): string =>
  (text ?? "").replace(/\s+/g, " ").trim();

test("one story, in order", () => {
  render(<HomePage />);

  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s.length).toBe(1);
  expect(normalize(h1s[0].textContent)).toBe(
    "Write one sentence. Watch it become working software.",
  );

  const h2s = screen
    .getAllByRole("heading", { level: 2 })
    .map((h) => normalize(h.textContent));
  expect(h2s).toEqual([
    "Between a prompt and the code, there is nothing to review.",
    "Follow one sentence all the way down",
    "One spec, four readers",
    "How a spec becomes code you can trust",
    "Browse the specs",
    "Start in two minutes",
  ]);
});

test("every top bar link has a place to land", () => {
  render(<HomePage />);

  for (const id of ["journey", "readers", "loop", "specs", "start"]) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});
