// ail-derived-from: WatchADemo@aa5e22b4c8601acb
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { WatchADemo } from "../../../src/gen/app/demo/watch-a-demo";

afterEach(() => {
  cleanup();
});

const pass = async (ms: number): Promise<void> => {
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  });
};

const statusText = (text: string): HTMLElement =>
  screen.getByText((_, el) => {
    if (!el || el.textContent?.trim() !== text) return false;
    return !Array.from(el.children).some((c) => c.textContent?.trim() === text);
  });

const marksOnBoard = (mark: "X" | "O"): number =>
  within(screen.getByRole("grid")).queryAllByText(mark).length;

const waitForEnd = async (): Promise<void> => {
  await waitFor(() => statusText("It's a draw"), { timeout: 9000, interval: 100 });
};

test("the demo starts on its own", () => {
  render(<WatchADemo />);
  expect(marksOnBoard("X")).toBe(0);
  expect(marksOnBoard("O")).toBe(0);
  expect(statusText("X's turn")).toBeTruthy();
});

test("the computer plays both sides", async () => {
  render(<WatchADemo />);
  await pass(650);
  expect(marksOnBoard("X")).toBe(1);
  expect(marksOnBoard("O")).toBe(0);
  expect(statusText("O's turn")).toBeTruthy();
  await pass(600);
  expect(marksOnBoard("X")).toBe(1);
  expect(marksOnBoard("O")).toBe(1);
  expect(statusText("X's turn")).toBeTruthy();
}, 5000);

test("perfect play ends in a draw", async () => {
  render(<WatchADemo />);
  await waitForEnd();
  expect(marksOnBoard("X")).toBe(5);
  expect(marksOnBoard("O")).toBe(4);
  expect(statusText("It's a draw")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Watch again" })).toBeTruthy();
}, 12000);

test("watch again", async () => {
  render(<WatchADemo />);
  await waitForEnd();
  fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
  expect(marksOnBoard("X")).toBe(0);
  expect(marksOnBoard("O")).toBe(0);
  expect(statusText("X's turn")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Watch again" })).toBeNull();
}, 12000);
