// ail-derived-from: StopBuild@b05710b06ece73c8
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
  const { container } = render(<StopBuild />);

  const article = container.querySelector("#stop-6");
  expect(article).not.toBeNull();
  const articles = screen.getAllByRole("article");
  expect(articles).toContain(article as HTMLElement);

  const scope = within(article as HTMLElement);
  scope.getByRole("heading", {
    level: 3,
    name: "Build: an agent compiles the node, seeing only its own slice.",
  });

  const region = scope.getByRole("region", { name: "Generated code excerpt" });
  const text = region.textContent ?? "";
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === "export function choose",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
