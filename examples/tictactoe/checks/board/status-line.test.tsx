// ail-derived-from: StatusLine@6b4190ea7974b3c7
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { StatusLine } from "../../src/gen/board/status-line";
import type { Mark, Status } from "../../src/gen/engine/game-state";

afterEach(() => {
  cleanup();
});

function renderedText(status: Status, next: Mark): string {
  const { container } = render(<StatusLine status={status} next={next} />);
  return (container.textContent ?? "").replace(/\s+/g, " ").trim();
}

test("whose turn", () => {
  expect(renderedText({ kind: "playing" }, "O")).toBe("O's turn");
});

test("a win", () => {
  expect(renderedText({ kind: "won", mark: "X", line: [0, 1, 2] }, "O")).toBe("X wins!");
});

test("a draw", () => {
  expect(renderedText({ kind: "draw" }, "O")).toBe("It's a draw");
});
