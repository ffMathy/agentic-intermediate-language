// ail-derived-from: SpecShot@48cd57e935570328
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { SpecShot } from "../../../src/gen/parts/spec-shot/spec-shot";

afterEach(() => {
  cleanup();
});

test("a screenshot is shown", () => {
  render(
    <SpecShot
      node="BoardView"
      test="a win"
      path="board/board-view/shots/01-a-win.png"
      src="/shots/board/board-view/01-a-win.png"
    />,
  );
  const region = screen.getByRole("region", {
    name: "Screenshot board/board-view/shots/01-a-win.png",
  });
  const image = within(region).getByRole("img", {
    name: "Screenshot at the end of the check “a win”",
  });
  expect(image).toBeTruthy();
  expect(region.textContent ?? "").toContain("BoardView");
});
