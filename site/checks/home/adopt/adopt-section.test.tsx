// ail-derived-from: AdoptSection@66002b1f508dbfe3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { AdoptSection } from "../../../src/gen/home/adopt/adopt-section";

afterEach(() => {
  cleanup();
});

const hasElementWithText = (root: HTMLElement, text: string): boolean =>
  Array.from(root.querySelectorAll("*")).some(
    (el) => (el.textContent ?? "").trim() === text,
  );

test("adopting is explained", () => {
  const { container } = render(<AdoptSection />);

  const section = container.querySelector("#adopt") as HTMLElement | null;
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);

  expect(
    scope.getByRole("heading", {
      level: 2,
      name: "Already have an app? Adopt it.",
    }),
  ).toBeTruthy();

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  for (const name of expected) {
    expect(scope.getByRole("heading", { level: 3, name })).toBeTruthy();
  }
  const h3Names = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim())
    .filter((name) => expected.includes(name));
  expect(h3Names).toEqual(expected);

  expect(hasElementWithText(section as HTMLElement, "/ail:adopt")).toBe(true);
  expect(hasElementWithText(section as HTMLElement, "ail adopt")).toBe(true);
});
