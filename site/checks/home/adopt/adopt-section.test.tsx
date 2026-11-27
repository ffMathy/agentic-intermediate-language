// ail-derived-from: AdoptSection@4c91c0cdbc017c04
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { AdoptSection } from "../../../src/gen/home/adopt/adopt-section";

afterEach(() => {
  cleanup();
});

test("adopting is explained", () => {
  const { container } = render(<AdoptSection />);

  const section = container.querySelector("#adopt");
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);

  const heading = scope.getByRole("heading", {
    level: 2,
    name: "Already have an app? Adopt it.",
  });
  expect(heading).toBeTruthy();

  const expectedSteps = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  for (const name of expectedSteps) {
    expect(scope.getByRole("heading", { level: 3, name })).toBeTruthy();
  }
  const levelThreeNames = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim())
    .filter((name) => expectedSteps.includes(name));
  expect(levelThreeNames).toEqual(expectedSteps);

  expect(scope.getByRole("button", { name: "Copy /ail:adopt" })).toBeTruthy();
  expect(scope.getByRole("button", { name: "Copy ail adopt" })).toBeTruthy();
  const text = section?.textContent ?? "";
  expect(text).toContain("/ail:adopt");
  expect(text).toContain("ail adopt");
});
