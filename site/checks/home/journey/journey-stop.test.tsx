// ail-derived-from: JourneyStop@b4ab241648fd3625
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

function elementsWithText(root: Element, text: string): Element[] {
  return Array.from(root.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === text,
  );
}

test("a stop", () => {
  const { container } = render(
    <JourneyStop
      number={4}
      color="level.system"
      depth="design"
      chip="SYSTEM"
      reader="engineers"
      headline="System level"
      explanation="An explanation of this level."
      lines={["4. The computer never loses.", "5. New game"]}
      label="Spec excerpt"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["never loses"]}
      turnsInto="Tests."
      figure={<svg aria-hidden="true" viewBox="0 0 360 200" />}
    />,
  );

  const article = container.querySelector("article#stop-4");
  expect(article).not.toBeNull();
  const stop = article as HTMLElement;

  expect(elementsWithText(stop, "4").length).toBeGreaterThan(0);

  const scope = within(stop);
  expect(scope.getAllByText("SYSTEM").length).toBeGreaterThan(0);

  expect(elementsWithText(stop, "Who reads this: engineers").length).toBeGreaterThan(0);

  expect(scope.getByRole("heading", { level: 3, name: "System level" })).toBeTruthy();

  expect(scope.getByRole("region", { name: "Spec excerpt" })).toBeTruthy();

  expect(elementsWithText(stop, "Turns into: Tests.").length).toBeGreaterThan(0);
});
