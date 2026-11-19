// ail-derived-from: GapStrip@5e23d5b82af8cefd
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { GapStrip } from "../../../src/gen/home/sections/gap-strip";

afterEach(() => {
  cleanup();
});

test("three cards", () => {
  render(<GapStrip />);
  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings.map((h) => (h.textContent ?? "").trim())).toEqual([
    "A prompt is too vague",
    "Code is too detailed",
    "AIL is the layer in between",
  ]);
});
