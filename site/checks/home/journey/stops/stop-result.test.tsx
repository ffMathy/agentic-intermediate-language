// ail-derived-from: StopResult@9f0e505b59cde474
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopResult } from "../../../../src/gen/home/journey/stops/stop-result";

afterEach(() => {
  cleanup();
});

test("the result", () => {
  render(<StopResult />);

  const article = document.getElementById("stop-8");
  expect(article).not.toBeNull();
  if (article === null) {
    throw new Error("article stop-8 not found");
  }
  expect(article.tagName.toLowerCase()).toBe("article");

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "The result: try to beat it.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "The promise, one last time",
  });
  expect(region.textContent ?? "").toContain("    4. The computer never loses.");

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "") === "The computer never loses.",
  );
  expect(highlighted.length).toBeGreaterThan(0);

  expect(article.textContent ?? "").toContain(
    "Apart from a short index.html, none of its code was written by hand.",
  );
});
