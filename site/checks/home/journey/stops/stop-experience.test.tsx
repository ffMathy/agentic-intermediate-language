// ail-derived-from: StopExperience@da9d6b6963b98c59
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopExperience } from "../../../../src/gen/home/journey/stops/stop-experience";

afterEach(() => {
  cleanup();
});

const headline =
  "Experience level: what the player sees, as scenarios anyone can test.";
const label = "Experience-level spec excerpt";
const mark = "the computer places an O";
const lines = [
  "node PlayAGame : flow   level: experience",
  "  …",
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
    .find((el) => el.id === "stop-3");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: headline,
  });
  expect(heading).toBeTruthy();

  const region = within(article).getByRole("region", { name: label });
  const text = region.textContent ?? "";

  let cursor = 0;
  for (const line of lines) {
    const needle = line.trim();
    const at = text.indexOf(needle, cursor);
    expect(at).toBeGreaterThanOrEqual(0);
    cursor = at + needle.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === mark,
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
