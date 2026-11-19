// ail-derived-from: JourneyStop@599f8799c54710b6
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

const normalize = (text: string | null): string =>
  (text ?? "").replace(/\s+/g, " ").trim();

const hasElementWithText = (root: Element, text: string): boolean =>
  Array.from(root.querySelectorAll("*")).some(
    (el) => normalize(el.textContent) === text,
  );

test("a stop", () => {
  render(
    <JourneyStop
      number={4}
      color="level.system"
      depth="Building blocks"
      chip="SYSTEM"
      reader="engineers"
      headline="System level"
      explanation="How the parts fit together."
      lines={["node Board : view", "  what"]}
      label="Spec excerpt"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["Board"]}
      turnsInto="Tests."
      figure={<svg aria-hidden="true" viewBox="0 0 360 200" />}
    />,
  );

  const article = screen.getByRole("article");
  expect(article.id).toBe("stop-4");

  expect(hasElementWithText(article, "4")).toBe(true);
  expect(hasElementWithText(article, "SYSTEM")).toBe(true);
  expect(hasElementWithText(article, "Who reads this: engineers")).toBe(true);
  within(article).getByRole("heading", { level: 3, name: "System level" });

  within(article).getByRole("region", { name: "Spec excerpt" });
  expect(hasElementWithText(article, "Turns into: Tests.")).toBe(true);
});
