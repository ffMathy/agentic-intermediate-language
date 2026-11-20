// ail-derived-from: AdoptSection@2c33a427ac92101c
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

  const h2 = scope.getByRole("heading", { level: 2 });
  expect(h2.textContent).toBe("Already have an app? Adopt it.");

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  const h3Texts = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  const stepTitles = h3Texts.filter((t) => expected.includes(t));
  expect(stepTitles).toEqual(expected);

  expect(scope.getAllByText("/ail:adopt").length).toBeGreaterThan(0);
  expect(scope.getAllByText("ail adopt").length).toBeGreaterThan(0);
});
