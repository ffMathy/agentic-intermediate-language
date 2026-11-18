// ail-derived-from: App@66c86574c5953fab
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../../src/gen/app/app";

afterEach(cleanup);

const squares = () => screen.getAllByRole("button", { name: /^Row \d, column \d, / });
const status = () => document.querySelector('[aria-live="polite"]')!.textContent;
const pickMode = (name: string) => fireEvent.click(screen.getByRole("radio", { name }));

test("switching to the demo", () => {
  render(<App />);
  expect(screen.getByRole("radiogroup", { name: "Mode" })).toBeTruthy();
  expect(screen.getByRole("radio", { name: "Play" }).getAttribute("aria-checked")).toBe("true");
  pickMode("Watch");
  expect(squares().every((s) => (s as HTMLButtonElement).disabled)).toBe(true);
  expect(status()).toBe("X's turn");
});

test("switching back starts a new game", () => {
  render(<App />);
  fireEvent.click(squares()[4]!);
  expect(status()).toBe("O's turn");
  pickMode("Watch");
  pickMode("Play");
  expect(squares().every((s) => s.getAttribute("aria-label")!.endsWith("empty"))).toBe(true);
  expect(status()).toBe("X's turn");
});
