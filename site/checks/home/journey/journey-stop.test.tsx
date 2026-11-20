// ail-derived-from: JourneyStop@05445e74ecbd3144
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

function hasElementWithText(root: HTMLElement, matcher: (text: string) => boolean): boolean {
  return Array.from(root.querySelectorAll("*")).some((el) => matcher(el.textContent ?? ""));
}

test("a stop", () => {
  render(
    <JourneyStop
      number={4}
      color="color.level.system"
      depth="depth 3"
      chip="SYSTEM"
      reader="engineers"
      headline="System level"
      explanation="How the parts fit together."
      lines={["node Game : flow"]}
      label="Spec excerpt"
      file="examples/tictactoe/game.ail.md"
      highlight={[]}
      turnsInto="Tests."
      figure={<div>Figure</div>}
    />,
  );

  const article = screen.getByRole("article");
  expect(article.id).toBe("stop-4");

  const view = within(article);
  expect(hasElementWithText(article, (text) => text.trim() === "4")).toBe(true);
  expect(hasElementWithText(article, (text) => text.trim() === "SYSTEM")).toBe(true);
  expect(
    hasElementWithText(article, (text) => text.trim() === "Who reads this: engineers"),
  ).toBe(true);
  expect(view.getByRole("heading", { level: 3, name: "System level" })).toBeTruthy();

  expect(view.getByRole("region", { name: "Spec excerpt" })).toBeTruthy();
  expect(
    hasElementWithText(article, (text) => /^\s*Turns into:\s+Tests\.\s*$/.test(text)),
  ).toBe(true);
});

test("a stop with a file to browse", () => {
  render(
    <JourneyStop
      number={2}
      color="color.level.product"
      depth="depth 1"
      chip="PRODUCT"
      reader="everyone"
      headline="Product level"
      explanation="What the product promises."
      lines={["The computer never loses."]}
      label="Spec excerpt"
      file="examples/tictactoe/ail-file.ail.md"
      highlight={["never loses"]}
      turnsInto="Experience nodes."
      figure={<div>Figure</div>}
      browse="#spec/tictactoe/ail-file.ail.md"
    />,
  );

  const link = screen.getByRole("link", { name: "Open the whole file in the spec browser ↓" });
  expect(link.getAttribute("href")).toBe("#spec/tictactoe/ail-file.ail.md");
});
