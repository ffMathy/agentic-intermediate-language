// ail-derived-from: PullRequestDiff@33eb42d689cb7e7a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { PullRequestDiff } from "../../../src/gen/home/review/pull-request-diff";

afterEach(() => {
  cleanup();
});

function diffLines(container: HTMLElement): string[] {
  const pre = container.querySelector("pre");
  expect(pre).not.toBeNull();
  return Array.from((pre as HTMLElement).querySelectorAll("div")).map(
    (line) => line.textContent ?? "",
  );
}

test("the spec change", () => {
  const { container } = render(<PullRequestDiff />);

  expect(
    screen.getByText("examples/tictactoe/ail/app/demo/demo.ail.md"),
  ).toBeTruthy();

  const lines = diffLines(container);
  expect(lines).toContain("+    Scenario: watch again");
  expect(lines).toContain(
    "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]",
  );
});
