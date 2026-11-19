// ail-derived-from: AdoptSection@6fe84ece6d3e44b3
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
  const h3Texts = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  for (const name of expected) {
    expect(h3Texts).toContain(name);
  }
  const inOrder = h3Texts.filter((t) => expected.includes(t));
  expect(inOrder).toEqual(expected);

  const text = (section as HTMLElement).textContent ?? "";
  expect(text).toContain("/ail:adopt");
  expect(text).toContain("ail adopt");
});
