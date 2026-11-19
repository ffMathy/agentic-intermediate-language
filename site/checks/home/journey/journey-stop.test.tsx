// ail-derived-from: JourneyStop@61aad169d5c29f47
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

function normalize(text: string | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function hasElementWithText(root: Element, text: string): boolean {
  const all = Array.from(root.querySelectorAll("*"));
  return all.some((el) => normalize(el.textContent) === text);
}

test("a stop", () => {
  const { container } = render(
    <JourneyStop
      number={4}
      color="level.system"
      depth="deeper"
      chip="SYSTEM"
      reader="engineers"
      headline="System level"
      explanation="Each promise becomes a check engineers can run."
      lines={["4. The computer never loses.", "5. New game"]}
      label="Spec excerpt"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["never loses"]}
      turnsInto="Tests."
      figure={<span>figure</span>}
    />,
  );

  const article = container.querySelector("article#stop-4");
  expect(article).not.toBeNull();
  const stop = article as HTMLElement;

  expect(hasElementWithText(stop, "4")).toBe(true);
  expect(hasElementWithText(stop, "SYSTEM")).toBe(true);
  expect(hasElementWithText(stop, "Who reads this: engineers")).toBe(true);

  const heading = within(stop).getByRole("heading", {
    level: 3,
    name: "System level",
  });
  expect(heading).toBeTruthy();

  const region = within(stop).getByRole("region", { name: "Spec excerpt" });
  expect(region).toBeTruthy();

  expect(hasElementWithText(stop, "Turns into: Tests.")).toBe(true);
});
