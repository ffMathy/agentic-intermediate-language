// ail-derived-from: ProofFigure@86ccc4e3c6a1562c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ProofFigure } from "../../../../src/gen/home/journey/stops/proof-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<ProofFigure />);
  const image = screen.getByRole("img", {
    name: "The thread runs from the promise through the scenario, the rules and the invariant to a passing test",
  });
  const text = image.textContent ?? "";
  expect(text).toContain("promise · product");
  expect(text).toContain("test · never loses");
});
