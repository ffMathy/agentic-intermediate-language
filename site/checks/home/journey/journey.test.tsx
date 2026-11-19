// ail-derived-from: Journey@04502606031f0ff2
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
  expect((headings[0].textContent ?? "").trim()).toBe(
    "It starts as a sentence anyone could say.",
  );
  expect((headings[7].textContent ?? "").trim()).toBe(
    "The result: try to beat it.",
  );

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
  const section = document.getElementById("journey");
  expect(section).not.toBeNull();
  expect(
    within(section as HTMLElement).getByText("the thread we are following"),
  ).toBeTruthy();
  expect(screen.getAllByText("the thread we are following").length).toBe(1);
});
