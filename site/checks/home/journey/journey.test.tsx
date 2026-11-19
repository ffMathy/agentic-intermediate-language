// ail-derived-from: Journey@ea5f50d26cd4b7f6
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Journey } from "../../../src/gen/home/journey/journey";

afterEach(() => {
  cleanup();
});

test("eight stops in order", () => {
  const { container } = render(<Journey />);
  const section = container.querySelector("#journey");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;

  const headings = within(band).getAllByRole("heading", { level: 3 });
  expect(headings.length).toBe(8);
  expect(headings[0].textContent).toBe("It starts as a sentence anyone could say.");
  expect(headings[7].textContent).toBe("The result: try to beat it.");

  const stopIds = Array.from(band.querySelectorAll("[id]"))
    .map((el) => el.id)
    .filter((id) => /^stop-\d+$/.test(id));
  expect(stopIds).toEqual([
    "stop-1",
    "stop-2",
    "stop-3",
    "stop-4",
    "stop-5",
    "stop-6",
    "stop-7",
    "stop-8",
  ]);
});

test("the thread is explained", () => {
  render(<Journey />);
  expect(screen.getByText("the thread we are following")).toBeTruthy();
});
