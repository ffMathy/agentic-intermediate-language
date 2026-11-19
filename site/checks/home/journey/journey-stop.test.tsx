// ail-derived-from: JourneyStop@4b258e0d0f912cdc
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

const baseProps = {
  number: 4,
  color: "color.level.system",
  depth: "deeper",
  chip: "SYSTEM",
  reader: "engineers",
  headline: "System level",
  explanation: "The explanation of this level.",
  lines: ["node Game : flow", "  what the computer never loses"],
  label: "Spec excerpt",
  file: "examples/tictactoe/tictactoe.ail.md",
  highlight: ["never loses"],
  turnsInto: "Tests.",
  figure: <svg aria-hidden="true" viewBox="0 0 360 200" />,
};

test("a stop", () => {
  render(<JourneyStop {...baseProps} />);

  const article = screen.getByRole("article");
  expect(article.getAttribute("id")).toBe("stop-4");

  const inArticle = within(article);
  expect(inArticle.getByText("4")).toBeTruthy();
  expect(inArticle.getByText("SYSTEM")).toBeTruthy();

  const text = article.textContent ?? "";
  expect(text).toContain("Who reads this: engineers");

  expect(
    inArticle.getByRole("heading", { level: 3, name: "System level" }),
  ).toBeTruthy();

  expect(inArticle.getByRole("region", { name: "Spec excerpt" })).toBeTruthy();

  expect(text).toMatch(/Turns into:\s+Tests\./);
});

test("a stop with a file to browse", () => {
  render(
    <JourneyStop {...baseProps} browse="#spec/tictactoe/ail-file.ail.md" />,
  );

  const link = screen.getByRole("link", {
    name: "Open the whole file in the spec browser ↓",
  });
  expect(link.getAttribute("href")).toBe("#spec/tictactoe/ail-file.ail.md");
});
