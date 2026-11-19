// ail-derived-from: LoopFigure@f8de293f08f7b3ad
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { LoopFigure } from "../../../src/gen/home/build-loop/loop-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<LoopFigure />);
  const image = screen.getByRole("img", {
    name: "Write, build, check and ask, in a loop around ail.lock.json",
  });
  expect(image).toBeTruthy();
});
