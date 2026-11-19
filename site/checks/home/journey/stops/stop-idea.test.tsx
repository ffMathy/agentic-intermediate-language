// ail-derived-from: StopIdea@e07158033873a2ef
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopIdea } from "../../../../src/gen/home/journey/stops/stop-idea";

afterEach(() => {
  cleanup();
});

test("the idea", () => {
  render(<StopIdea />);

  const article = screen
    .getAllByRole("article")
    .find((el) => el.id === "stop-1");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "It starts as a sentence anyone could say.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "The idea, at the top of the spec",
  });
  const text = region.textContent ?? "";
  const lines = [
    "  why   A quick, familiar game people can finish in under a minute,",
    "        alone or with a friend on the same device.",
    "  …",
    "    4. The computer never loses.",
  ];
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const highlighted = Array.from(region.querySelectorAll("*")).some(
    (el) => el.textContent === "The computer never loses.",
  );
  expect(highlighted).toBe(true);
});
