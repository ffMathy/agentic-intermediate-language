// ail-derived-from: App@77999248f6cdb439
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../../src/gen/app/app";

afterEach(() => {
  cleanup();
});

function statusText(container: HTMLElement): string {
  const live = container.querySelector("[aria-live]");
  expect(live).not.toBeNull();
  return (live?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function squares(): HTMLElement[] {
  return screen
    .queryAllByRole("button")
    .filter((b) => {
      const name = (b.getAttribute("aria-label") ?? b.textContent ?? "").trim();
      return name !== "New game" && name !== "Watch again";
    });
}

function boardSnapshot(): string[] {
  return squares().map(
    (s) => `${s.getAttribute("aria-label") ?? ""}|${s.textContent ?? ""}`,
  );
}

test("switching to the demo", () => {
  const { container } = render(<App />);
  expect(screen.getByRole("radiogroup", { name: "Mode" })).toBeTruthy();
  expect(
    screen.getByRole("radio", { name: "Play" }).getAttribute("aria-checked"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("radio", { name: "Watch" }));

  expect(
    screen.getByRole("radio", { name: "Watch" }).getAttribute("aria-checked"),
  ).toBe("true");
  expect(screen.queryByRole("button", { name: "New game" })).toBeNull();
  expect(statusText(container)).toBe("X's turn");

  const before = boardSnapshot();
  const pickable = [
    ...screen.queryAllByRole("button"),
    ...screen.queryAllByRole("gridcell"),
  ];
  for (const el of pickable) {
    fireEvent.click(el);
  }
  expect(boardSnapshot()).toEqual(before);
  expect(statusText(container)).toBe("X's turn");
});

test("switching back starts a new game", () => {
  const { container } = render(<App />);
  const emptyBoard = boardSnapshot();
  expect(squares().length).toBe(9);

  fireEvent.click(squares()[4]);
  expect(statusText(container)).toBe("O's turn");
  expect(boardSnapshot()).not.toEqual(emptyBoard);

  fireEvent.click(screen.getByRole("radio", { name: "Watch" }));
  fireEvent.click(screen.getByRole("radio", { name: "Play" }));

  expect(
    screen.getByRole("radio", { name: "Play" }).getAttribute("aria-checked"),
  ).toBe("true");
  expect(boardSnapshot()).toEqual(emptyBoard);
  expect(statusText(container)).toBe("X's turn");
});
