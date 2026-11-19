// ail-derived-from: StopResult@59233776b3ce7e51
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopResult } from "../../../../src/gen/home/journey/stops/stop-result";

afterEach(() => {
  cleanup();
});

function getStop(): HTMLElement {
  const articles = screen.getAllByRole("article");
  const stop = articles.find((a) => a.id === "stop-8");
  if (!stop) {
    throw new Error('No article with id "stop-8"');
  }
  return stop;
}

test("the result", () => {
  render(<StopResult />);

  const stop = getStop();
  expect(
    within(stop).getByRole("heading", {
      level: 3,
      name: "The result: try to beat it.",
    }),
  ).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "The promise, one last time",
  });
  expect(region.textContent ?? "").toContain("    4. The computer never loses.");

  const mark = "The computer never loses.";
  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "") === mark,
  );
  expect(highlighted.length).toBeGreaterThan(0);

  expect(stop.textContent ?? "").toContain(
    "Apart from a short index.html, none of its code was written by hand.",
  );
});
