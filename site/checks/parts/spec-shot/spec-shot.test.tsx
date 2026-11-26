// ail-derived-from: SpecShot@8b006337992e06bb
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { SpecShot } from "../../../src/gen/parts/spec-shot/spec-shot";

afterEach(() => {
  cleanup();
});

test("a screenshot is shown", () => {
  const src = "data:image/png;base64,iVBORw0KGgo=";
  render(
    <SpecShot
      node="BoardView"
      test="a win"
      path="board/shots/board-view/01-a-win.png"
      src={src}
    />,
  );
  const region = screen.getByRole("region", {
    name: "Screenshot board/shots/board-view/01-a-win.png",
  });
  const image = within(region).getByRole("img", {
    name: "Screenshot at the end of the check “a win”",
  });
  expect(image.getAttribute("src")).toBe(src);
  expect(region.textContent ?? "").toContain("BoardView");
});
