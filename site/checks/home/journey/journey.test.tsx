// ail-derived-from: Journey@f7e74da5e25f8385
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Journey } from "../../../src/gen/home/journey/journey";

afterEach(() => {
  cleanup();
});

test("eight stops in order", () => {
  render(<Journey />);
  const section = document.getElementById("journey");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;
  const headings = within(band).getAllByRole("heading", { level: 3 });
  expect(headings.length).toBe(8);
  expect((headings[0].textContent ?? "").trim()).toBe("It starts with what the product owner wants.");
  expect((headings[7].textContent ?? "").trim()).toBe("The result: try to beat it.");

  const stops: HTMLElement[] = [];
  for (let n = 1; n <= 8; n++) {
    const stop = document.getElementById(`stop-${n}`);
    expect(stop).not.toBeNull();
    expect(band.contains(stop)).toBe(true);
    stops.push(stop as HTMLElement);
  }
  for (let i = 0; i < stops.length - 1; i++) {
    const position = stops[i].compareDocumentPosition(stops[i + 1]);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
});

test("the thread is explained", () => {
  render(<Journey />);
  const legend = screen.getByText("the thread we are following");
  expect((legend.textContent ?? "").trim()).toBe("the thread we are following");
});
