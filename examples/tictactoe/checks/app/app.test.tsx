// ail-derived-from: App@c7469df37fdb9d33
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "../../src/gen/app/app";

afterEach(() => {
  cleanup();
});

function modeOption(name: "Play" | "Watch"): HTMLElement {
  const group = screen.getByRole("radiogroup", { name: "Mode" });
  return within(group).getByRole("radio", { name });
}

const status = () => document.querySelector('[aria-live="polite"]')!.textContent;

function pickables(): HTMLElement[] {
  return [
    ...screen.queryAllByRole("button"),
    ...screen.queryAllByRole("gridcell"),
  ];
}

test("switching to the demo", () => {
  render(<App />);
  expect(modeOption("Play").getAttribute("aria-checked")).toBe("true");

  fireEvent.click(modeOption("Watch"));

  expect(modeOption("Watch").getAttribute("aria-checked")).toBe("true");
  expect(status()).toBe("X's turn");

  for (const el of pickables()) {
    fireEvent.click(el);
  }

  expect(status()).toBe("X's turn");
  expect(status()).not.toBe("O's turn");
  expect(screen.queryAllByRole("button", { name: /^Row \d, column \d, [XO]$/ }).length).toBe(0);
});

test("switching back starts a new game", () => {
  render(<App />);
  expect(status()).toBe("X's turn");

  for (const el of pickables()) {
    fireEvent.click(el);
    if (status() === "O's turn") break;
  }
  expect(status()).toBe("O's turn");

  fireEvent.click(modeOption("Watch"));
  fireEvent.click(modeOption("Play"));

  expect(modeOption("Play").getAttribute("aria-checked")).toBe("true");
  expect(status()).toBe("X's turn");
  expect(status()).not.toBe("O's turn");
  expect(screen.queryAllByRole("button", { name: /^Row \d, column \d, [XO]$/ }).length).toBe(0);
});
