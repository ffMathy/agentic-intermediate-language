// ail-derived-from: AdoptSection@96e225b009a2064e
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
    scope.getByRole("heading", { level: 2, name: "Already have an app? Adopt it." }),
  ).toBeTruthy();

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  const h3Names = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  for (const name of expected) {
    expect(h3Names).toContain(name);
  }
  const positions = expected.map((name) => h3Names.indexOf(name));
  const sorted = [...positions].sort((a, b) => a - b);
  expect(positions).toEqual(sorted);

  const text = (section as HTMLElement).textContent ?? "";
  expect(text).toContain("/ail:adopt");
  expect(text).toContain("ail adopt");
});
