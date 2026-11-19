// ail-derived-from: StopResult@708882b3937f76ff
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopResult } from "../../../../src/gen/home/journey/stops/stop-result";

afterEach(() => {
  cleanup();
});

test("the result", () => {
  const { container } = render(<StopResult />);

  const article = container.querySelector("article#stop-8");
  expect(article).not.toBeNull();
  const stop = article as HTMLElement;

  const heading = within(stop).getByRole("heading", {
    level: 3,
    name: "The result: try to beat it.",
  });
  expect(heading).toBeTruthy();

  const region = within(stop).getByRole("region", {
    name: "The promise, one last time",
  });
  expect(region.textContent ?? "").toContain("    4. The computer never loses.");

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "") === "The computer never loses.",
  );
  expect(highlighted.length).toBeGreaterThan(0);

  expect(stop.textContent ?? "").toContain(
    "Apart from a short index.html, none of its code was written by hand.",
  );
});
