// ail-derived-from: AdoptSection@e1605c91943ea6f9
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
  const band = section as HTMLElement;

  const heading = within(band).getByRole("heading", {
    level: 2,
    name: "Already have an app? Adopt it.",
  });
  expect(heading).toBeTruthy();

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  const h3Texts = within(band)
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  const positions = expected.map((name) => h3Texts.indexOf(name));
  for (const position of positions) {
    expect(position).toBeGreaterThanOrEqual(0);
  }
  for (let i = 1; i < positions.length; i++) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  }

  const text = band.textContent ?? "";
  expect(text).toContain("/ail:adopt");
  expect(text).toContain("ail adopt");
});
