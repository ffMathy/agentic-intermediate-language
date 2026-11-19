// ail-derived-from: StopResult@d5b0eea494c67825
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopResult } from "../../../../src/gen/home/journey/stops/stop-result";

afterEach(() => {
  cleanup();
});

test("the result", () => {
  const { container } = render(<StopResult />);

  const article = container.querySelector("article#stop-8");
  expect(article).not.toBeNull();
  const stop = article as HTMLElement;

  expect(
    within(stop).getByRole("heading", {
      level: 3,
      name: "The result: try to beat it.",
    }),
  ).toBeTruthy();

  const line = "    4. The computer never loses.";
  const mark = "The computer never loses.";
  const region = screen.getByRole("region", {
    name: "The promise, one last time",
  });
  expect(region.textContent ?? "").toContain(line);

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === mark,
  );
  expect(highlighted.length).toBeGreaterThan(0);
  const parentOfHighlight = highlighted[0].parentElement;
  expect(parentOfHighlight).not.toBeNull();
  expect((parentOfHighlight as HTMLElement).textContent ?? "").toContain(line);
  expect((parentOfHighlight as HTMLElement).textContent).not.toBe(mark);

  expect(stop.textContent ?? "").toContain(
    "Apart from a short index.html, none of its code was written by hand.",
  );
});
