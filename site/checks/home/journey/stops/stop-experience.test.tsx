// ail-derived-from: StopExperience@6dd8485b9baf7fcc
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopExperience } from "../../../../src/gen/home/journey/stops/stop-experience";

afterEach(() => {
  cleanup();
});

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
  const { container } = render(<StopExperience />);

  const article = container.querySelector("article#stop-3");
  expect(article).not.toBeNull();
  const scope = within(article as HTMLElement);

  const heading = scope.getByRole("heading", { level: 3 });
  expect(heading.textContent).toBe(
    "Experience level: what the player sees, as scenarios anyone can test.",
  );

  const region = scope.getByRole("region", { name: "Experience-level spec excerpt" });
  const regionText = region.textContent ?? "";
  for (const line of lines) {
    expect(regionText).toContain(line);
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === "the computer places an O",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
