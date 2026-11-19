// ail-derived-from: StopBuild@68ac485d2651f4f3
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

  const article = screen
    .getAllByRole("article")
    .find((el) => el.id === "stop-6");
  expect(article).toBeDefined();
  if (!article) return;

  within(article).getByRole("heading", {
    level: 3,
    name: "Build: an agent compiles the node, seeing only its own slice.",
  });

  const region = within(article).getByRole("region", {
    name: "Generated code excerpt",
  });
  const text = region.textContent ?? "";
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const marks = Array.from(region.querySelectorAll("mark")).map(
    (m) => m.textContent,
  );
  expect(marks).toContain("export function choose");
});
