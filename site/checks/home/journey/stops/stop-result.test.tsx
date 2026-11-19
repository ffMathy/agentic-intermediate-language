// ail-derived-from: StopResult@cc421ae84e82e5b3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopResult } from "../../../../src/gen/home/journey/stops/stop-result";

afterEach(() => {
  cleanup();
});

test("the result", () => {
  render(<StopResult />);

  const article = screen
    .getAllByRole("article")
    .find((element) => element.id === "stop-8");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "The result: try to beat it.",
  });
  expect(heading).toBeDefined();

  const region = screen.getByRole("region", {
    name: "The promise, one last time",
  });
  expect(region.textContent ?? "").toContain("    4. The computer never loses.");

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (element) => element.textContent === "The computer never loses.",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
