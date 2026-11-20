// ail-derived-from: WatchADemo@c0a573e3516634be
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { WatchADemo } from "../../../src/gen/app/demo/watch-a-demo";

afterEach(() => {
  cleanup();
});

const sleep = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

function statusText(container: HTMLElement): string {
  const live = container.querySelector("[aria-live]");
  expect(live).not.toBeNull();
  return (live?.textContent ?? "").trim();
}

function squares(): HTMLElement[] {
  return within(screen.getByRole("grid")).getAllByRole("button");
}

function countMark(mark: "X" | "O"): number {
  return squares().filter((s) => (s.textContent ?? "").trim() === mark).length;
}

async function playToEnd(): Promise<void> {
  await waitFor(
    () => {
      expect(screen.getByRole("button", { name: "Watch again" })).toBeTruthy();
    },
    { timeout: 9000, interval: 100 },
  );
}

test("the demo starts on its own", () => {
  const { container } = render(<WatchADemo />);
  expect(squares().length).toBe(9);
  expect(countMark("X")).toBe(0);
  expect(countMark("O")).toBe(0);
  expect(statusText(container)).toBe("X's turn");
});

test("the computer plays both sides", async () => {
  const { container } = render(<WatchADemo />);
  await sleep(900);
  expect(countMark("X")).toBe(1);
  expect(countMark("O")).toBe(0);
  expect(statusText(container)).toBe("O's turn");
  await sleep(600);
  expect(countMark("X")).toBe(1);
  expect(countMark("O")).toBe(1);
  expect(statusText(container)).toBe("X's turn");
}, 10000);

test("perfect play ends in a draw", async () => {
  const { container } = render(<WatchADemo />);
  await waitFor(
    () => {
      expect(countMark("X") + countMark("O")).toBe(9);
    },
    { timeout: 9000, interval: 100 },
  );
  await waitFor(() => {
    expect(statusText(container)).toBe("It's a draw");
    expect(screen.getByRole("button", { name: "Watch again" })).toBeTruthy();
  });
}, 15000);

test("watch again", async () => {
  const { container } = render(<WatchADemo />);
  await playToEnd();
  fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
  expect(countMark("X")).toBe(0);
  expect(countMark("O")).toBe(0);
  expect(statusText(container)).toBe("X's turn");
  expect(screen.queryByRole("button", { name: "Watch again" })).toBeNull();
}, 15000);
