// ail-derived-from: AdoptSection@ff71d2a4a590a538
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
  const names = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim())
    .filter((name) => expected.includes(name));
  expect(names).toEqual(expected);

  expect(scope.getByRole("button", { name: "Copy /ail:adopt" })).toBeTruthy();
  expect(scope.getByRole("button", { name: "Copy ail adopt" })).toBeTruthy();
  const text = section?.textContent ?? "";
  expect(text).toContain("/ail:adopt");
  expect(text).toContain("ail adopt");
});
