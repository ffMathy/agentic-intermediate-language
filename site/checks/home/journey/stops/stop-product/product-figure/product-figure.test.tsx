// ail-derived-from: ProductFigure@24b4fabe73f6ae2c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductFigure } from "../../../../../../src/gen/home/journey/stops/stop-product/product-figure/product-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<ProductFigure />);
  const image = screen.getByRole("img", {
    name: "Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer",
  });
  const text = image.textContent ?? "";
  expect(text).toContain("4 never loses");
  expect(text).toContain("ComputerPlayer");
});
