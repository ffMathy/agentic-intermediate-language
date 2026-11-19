// ail-derived-from: StopBuild@3114d34ba50bb76f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopBuild } from "../../../../src/gen/home/journey/stops/stop-build";

afterEach(() => {
  cleanup();
});

const lines = [
  "/** choose(board: Board, me: Mark = \"O\") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */",
  "export function choose(board: Board, me: Mark = \"O\"): number {",
  "  let bestIndex = -1;",
  "  let bestScore = -Infinity;",
  "  …",
  "  return bestIndex;",
  "}",
];

test("the build", () => {
  render(<StopBuild />);

  const article = document.getElementById("stop-6");
  expect(article).not.toBeNull();
  expect(article?.tagName.toLowerCase()).toBe("article");

  const heading = within(article as HTMLElement).getByRole("heading", {
    level: 3,
    name: "Build: an agent compiles the node, seeing only its own slice.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", { name: "Generated code excerpt" });
  expect(article?.contains(region)).toBe(true);

  const text = region.textContent ?? "";
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line.trim(), from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.trim().length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === "export function choose",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
