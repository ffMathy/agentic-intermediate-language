// ail-derived-from: Journey@ae9185c163ac2d81
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
  expect(band.tagName.toLowerCase()).toBe("section");

  const headings = within(band).getAllByRole("heading", { level: 3 });
  expect(headings.length).toBe(8);
  const first = within(band).getByRole("heading", {
    level: 3,
    name: "It starts with what the product owner wants.",
  });
  const last = within(band).getByRole("heading", {
    level: 3,
    name: "The result: try to beat it.",
  });
  expect(headings[0]).toBe(first);
  expect(headings[7]).toBe(last);

  const stopIds = Array.from(band.querySelectorAll('[id^="stop-"]')).map(
    (el) => el.id,
  );
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
  const section = document.getElementById("journey") as HTMLElement;
  expect(section).not.toBeNull();
  const legend = within(section).getByText("the thread we are following");
  expect(legend.textContent).toBe("the thread we are following");
  expect(screen.getAllByText("the thread we are following").length).toBe(1);
});
