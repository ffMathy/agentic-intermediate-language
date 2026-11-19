// ail-derived-from: StopExperience@b2635cc8c6be046a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopExperience } from "../../../../src/gen/home/journey/stops/stop-experience";

afterEach(() => {
  cleanup();
});

const lines = [
  "node PlayAGame : flow   level: experience",
  "    Scenario: the computer answers",
  "      Given the opponent is the computer",
  "      When X picks a square",
  "      Then shortly after, the computer places an O",
  "      And the status says \"X's turn\" again",
  "  how",
  "    decide the computer answers after 300 ms",
  "      because an instant answer feels like the player's own move didn't count",
  "      rejected a random pause because it makes behaviour unpredictable and tests slow",
];

test("the experience level", () => {
  render(<StopExperience />);

  const article = screen
    .getAllByRole("article")
    .find((element) => element.id === "stop-3");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "Experience level: what the player sees, as scenarios anyone can test.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "Experience-level spec excerpt",
  });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line);
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (element) => element.textContent === "the computer places an O",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
