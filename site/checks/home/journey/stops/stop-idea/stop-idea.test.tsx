// ail-derived-from: StopIdea@59b60f24fe521df0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopIdea } from "../../../../../src/gen/home/journey/stops/stop-idea/stop-idea";

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

const highlight = "4. The computer never loses.";

function deepestWithText(root: HTMLElement, text: string): Element | undefined {
  const matches = Array.from(root.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === text,
  );
  return matches[matches.length - 1];
}

function signature(el: Element): string {
  return `${el.tagName}|${el.getAttribute("style") ?? ""}`;
}

test("the idea", () => {
  render(<StopIdea />);

  const article = screen
    .getAllByRole("article")
    .find((el) => el.id === "stop-1");
  expect(article).toBeDefined();
  const stop = article as HTMLElement;

  within(stop).getByRole("heading", {
    level: 3,
    name: "It starts with what the product owner wants.",
  });

  const region = within(stop).getByRole("region", {
    name: "What the product owner asked for",
  });
  const text = region.textContent ?? "";

  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const elements = lines.map((line) => deepestWithText(region, line));
  for (const el of elements) {
    expect(el).toBeDefined();
  }
  const highlighted = elements[lines.indexOf(highlight)] as Element;
  const highlightSig = signature(highlighted);
  elements.forEach((el, i) => {
    if (lines[i] !== highlight) {
      expect(signature(el as Element)).not.toBe(highlightSig);
    }
  });
});
