// ail-derived-from: StatusLine@8d34d5e32154cd22
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { StatusLine } from "../../src/gen/board/status-line";

afterEach(cleanup);

const text = (ui: ReactElement) => render(ui).container.querySelector('[aria-live="polite"]')!.textContent;

test("whose turn", () => {
  expect(text(<StatusLine status={{ kind: "playing" }} next="O" />)).toBe("O's turn");
});

test("a win", () => {
  expect(text(<StatusLine status={{ kind: "won", mark: "X", line: [0, 1, 2] }} next="X" />)).toBe("X wins!");
});

test("a draw", () => {
  expect(text(<StatusLine status={{ kind: "draw" }} next="X" />)).toBe("It's a draw");
});
