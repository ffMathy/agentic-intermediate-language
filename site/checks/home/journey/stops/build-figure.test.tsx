// ail-derived-from: BuildFigure@b265a0a2b70fd2ea
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { BuildFigure } from "../../../../src/gen/home/journey/stops/build-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<BuildFigure />);
  const image = screen.getByRole("img", {
    name: "The ComputerPlayer node goes into a compiler agent and comes out as a 69-line file; a reviewer reads the 27-line node",
  });
  expect(image).toBeTruthy();
  const text = image.textContent ?? "";
  expect(text).toContain("compiler agent");
  expect(text).toContain("27 lines");
  expect(text).toContain("69 lines");
});
