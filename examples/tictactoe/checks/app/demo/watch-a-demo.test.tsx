// ail-derived-from: WatchADemo@963a050d0a93c898
import { afterEach, beforeEach, expect, jest, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WatchADemo } from "../../../src/gen/app/demo/watch-a-demo";

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

const squares = () => screen.getAllByRole("button", { name: /^Row \d, column \d, / });
const marks = (mark: string) => squares().filter((s) => s.getAttribute("aria-label")!.endsWith(mark)).length;
const status = () => document.querySelector('[aria-live="polite"]')!.textContent;
const wait = (ms: number) => act(() => jest.advanceTimersByTime(ms));
const again = () => screen.queryByRole("button", { name: "Watch again" });

test("the demo starts on its own", () => {
  render(<WatchADemo />);
  expect(marks("empty")).toBe(9);
  expect(status()).toBe("X's turn");
  expect(squares().every((s) => (s as HTMLButtonElement).disabled)).toBe(true);
});

test("the computer plays both sides", () => {
  render(<WatchADemo />);
  wait(600);
  expect(marks("X")).toBe(1);
  expect(status()).toBe("O's turn");
  wait(600);
  expect(marks("O")).toBe(1);
  expect(status()).toBe("X's turn");
});

test("perfect play ends in a draw", () => {
  render(<WatchADemo />);
  expect(again()).toBeNull();
  for (let i = 0; i < 9; i++) wait(600);
  expect(status()).toBe("It's a draw");
  expect(again()).not.toBeNull();
});

test("watch again", () => {
  render(<WatchADemo />);
  for (let i = 0; i < 9; i++) wait(600);
  fireEvent.click(again()!);
  expect(marks("empty")).toBe(9);
  expect(status()).toBe("X's turn");
  expect(again()).toBeNull();
});
