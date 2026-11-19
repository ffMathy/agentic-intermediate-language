// ail-derived-from: StopBuild@2391650d21709175
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

  const article = container.querySelector("article#stop-6");
  expect(article).not.toBeNull();
  const stop = article as HTMLElement;

  const heading = within(stop).getByRole("heading", {
    level: 3,
    name: "Build: an agent compiles the node, seeing only its own slice.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", { name: "Generated code excerpt" });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === "export function choose",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
