// ail-derived-from: AdoptSection@270d688eaa2b355c
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
  const band = within(section as HTMLElement);

  expect(
    band.getByRole("heading", { level: 2, name: "Already have an app? Adopt it." }),
  ).toBeTruthy();

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  for (const name of expected) {
    expect(band.getByRole("heading", { level: 3, name })).toBeTruthy();
  }
  const order = band
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim())
    .filter((t) => expected.includes(t));
  expect(order).toEqual(expected);

  const sectionText = (section as HTMLElement).textContent ?? "";
  expect(sectionText).toContain("/ail:adopt");
  expect(sectionText).toContain("ail adopt");
  expect(band.getByRole("button", { name: "Copy /ail:adopt" })).toBeTruthy();
  expect(band.getByRole("button", { name: "Copy ail adopt" })).toBeTruthy();
});
