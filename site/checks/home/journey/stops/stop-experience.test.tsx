// ail-derived-from: StopExperience@01c9b0f351dcdd4a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
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
  render(<StopExperience />);

  const article = document.getElementById("stop-3");
  expect(article).not.toBeNull();
  const articleEl = article as HTMLElement;
  expect(articleEl.tagName.toLowerCase() === "article" || articleEl.getAttribute("role") === "article").toBe(true);
  expect(
    within(articleEl).getByRole("heading", {
      level: 3,
      name: "Experience level: what the player sees, as scenarios anyone can test.",
    }),
  ).toBeTruthy();

  const region = screen.getByRole("region", { name: "Experience-level spec excerpt" });
  const text = region.textContent ?? "";
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const marks = Array.from(region.querySelectorAll("mark")).map((m) => m.textContent ?? "");
  expect(marks).toContain("the computer places an O");
});
