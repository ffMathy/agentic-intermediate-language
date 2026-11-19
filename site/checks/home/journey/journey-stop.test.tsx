// ail-derived-from: JourneyStop@fc713e6627156855
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

const norm = (s: string | null): string => (s ?? "").replace(/\s+/g, " ").trim();

const hasElementWithText = (root: HTMLElement, text: string): boolean =>
  Array.from(root.querySelectorAll("*")).some((el) => norm(el.textContent) === text);

const baseProps = {
  number: 4,
  color: "color.level.system",
  depth: "Deep",
  chip: "SYSTEM",
  reader: "engineers",
  headline: "System level",
  explanation: "An explanation of this level.",
  lines: ["4. The computer never loses."],
  label: "Spec excerpt",
  file: "examples/tictactoe/tictactoe.ail.md",
  highlight: ["never loses"],
  turnsInto: "Tests.",
  figure: <div>Figure</div>,
};

test("a stop", () => {
  const { container } = render(<JourneyStop {...baseProps} />);
  const article = container.querySelector("article#stop-4") as HTMLElement | null;
  expect(article).not.toBeNull();
  if (!article) return;
  expect(hasElementWithText(article, "4")).toBe(true);
  expect(hasElementWithText(article, "SYSTEM")).toBe(true);
  expect(hasElementWithText(article, "Who reads this: engineers")).toBe(true);
  const heading = within(article).getByRole("heading", { level: 3, name: "System level" });
  expect(heading).toBeTruthy();
  const region = within(article).getByRole("region", { name: "Spec excerpt" });
  expect(region).toBeTruthy();
  expect(hasElementWithText(article, "Turns into: Tests.")).toBe(true);
});

test("a stop with a file to browse", () => {
  render(<JourneyStop {...baseProps} browse="#spec/tictactoe/ail-file.ail.md" />);
  const link = screen.getByRole("link", { name: "Open the whole file in the spec browser ↓" });
  expect(link.getAttribute("href")).toBe("#spec/tictactoe/ail-file.ail.md");
});
