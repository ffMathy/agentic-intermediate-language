// ail-derived-from: StopIdea@31d2ba75f380b2dd
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopIdea } from "../../../../src/gen/home/journey/stops/stop-idea";

afterEach(() => {
  cleanup();
});

const lines = [
  "Tic-Tac-Toe: a quick, familiar game people can finish in under a minute,",
  "alone or with a friend on the same device.",
  "1. Two players take turns placing their mark on a 3 × 3 board.",
  "2. Three marks in a line wins; a full board with no winner is a draw.",
  "3. You can play against a friend or against the computer.",
  "4. The computer never loses.",
  "5. You can start a new game at any time.",
  "6. You can watch the computer play itself, move by move.",
];

test("the idea", () => {
  render(<StopIdea />);

  const article = document.getElementById("stop-1");
  expect(article).not.toBeNull();
  expect(article?.tagName).toBe("ARTICLE");
  const scope = within(article as HTMLElement);

  expect(
    scope.getByRole("heading", {
      level: 3,
      name: "It starts with what the product owner wants.",
    }),
  ).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "What the product owner asked for",
  });
  const text = region.textContent ?? "";

  let last = -1;
  for (const line of lines) {
    const at = text.indexOf(line, last + 1);
    expect(at).toBeGreaterThan(last);
    last = at;
  }

  const highlight = "4. The computer never loses.";
  const holders = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === highlight,
  );
  expect(holders.length).toBeGreaterThan(0);
});
