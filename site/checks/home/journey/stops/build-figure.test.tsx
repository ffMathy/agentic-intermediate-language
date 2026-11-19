// ail-derived-from: BuildFigure@75b7c94e3344c25f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { BuildFigure } from "../../../../src/gen/home/journey/stops/build-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<BuildFigure />);
  const picture = screen.getByRole("img", {
    name: "The ComputerPlayer node goes into a compiler agent and comes out as a 69-line file; a reviewer reads the 27-line node",
  });
  expect(picture).toBeTruthy();
  const text = picture.textContent ?? "";
  expect(text).toContain("compiler");
  expect(text).toContain("agent");
  expect(text).toContain("27 lines");
  expect(text).toContain("69 lines");
});
