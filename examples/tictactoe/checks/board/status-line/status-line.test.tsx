// ail-derived-from: StatusLine@43aecc536eafdf5e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { StatusLine } from "../../../src/gen/board/status-line/status-line";

afterEach(() => {
  cleanup();
});

function statusText(container: HTMLElement): string {
  const live = container.querySelector("[aria-live]");
  expect(live).not.toBeNull();
  return (live?.textContent ?? "").trim();
}

test("whose turn", () => {
  const { container } = render(
    <StatusLine status={{ kind: "playing" }} next="O" />,
  );
  expect(statusText(container)).toBe("O's turn");
});

test("a win", () => {
  const { container } = render(
    <StatusLine status={{ kind: "won", mark: "X", line: [0, 1, 2] }} next="O" />,
  );
  expect(statusText(container)).toBe("X wins!");
});

test("a draw", () => {
  const { container } = render(
    <StatusLine status={{ kind: "draw" }} next="X" />,
  );
  expect(statusText(container)).toBe("It's a draw");
});
