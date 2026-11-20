// ail-derived-from: StopBuild@feabd49dfe8e432b
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopBuild } from "../../../../src/gen/home/journey/stops/stop-build";

afterEach(() => {
  cleanup();
});

test("the build", () => {
  render(<StopBuild />);

  const article = screen
    .getAllByRole("article")
    .find((element) => element.id === "stop-6");
  expect(article).toBeDefined();
  if (!article) return;

  expect(
    within(article).getByRole("heading", {
      level: 3,
      name: "Build: an agent compiles the node, seeing only its own slice.",
    }),
  ).toBeTruthy();

  const region = screen.getByRole("region", { name: "Generated code excerpt" });
  const text = region.textContent ?? "";
  const lines = [
    "/** choose(board: Board, me: Mark = \"O\") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */",
    "export function choose(board: Board, me: Mark = \"O\"): number {",
    "  let bestIndex = -1;",
    "  let bestScore = -Infinity;",
    "  …",
    "  return bestIndex;",
    "}",
  ];
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (element) => element.textContent === "export function choose",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
