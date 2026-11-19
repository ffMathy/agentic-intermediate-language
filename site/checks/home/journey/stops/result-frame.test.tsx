// ail-derived-from: ResultFrame@bcaa2f989a2a28f6
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ResultFrame } from "../../../../src/gen/home/journey/stops/result-frame";

afterEach(() => {
  cleanup();
});

const TITLE = "Tic-Tac-Toe, built from its AIL spec";

function toPx(value: string, viewportWidth: number): number | null {
  const v = value.trim();
  if (v === "") return null;
  const px = /^(-?\d+(?:\.\d+)?)px$/.exec(v);
  if (px) return Number(px[1]);
  const vw = /^(-?\d+(?:\.\d+)?)vw$/.exec(v);
  if (vw) return (Number(vw[1]) * viewportWidth) / 100;
  return null;
}

test("the game is embedded", () => {
  render(<ResultFrame />);

  const frame = screen.getByTitle(TITLE);
  expect(frame.tagName.toLowerCase()).toBe("iframe");
  expect(frame.getAttribute("src")).toBe("./demo/");

  const link = screen.getByRole("link", { name: "Open the game full screen ↗" });
  expect(link.getAttribute("href")).toBe("./demo/");

  const hint = screen.getByText("Pick “Computer”, then play as X");
  expect(hint.textContent).toBe("Pick “Computer”, then play as X");
});

test("the game fits a phone", () => {
  const viewportWidth = 375;
  render(<ResultFrame />);

  const frame = screen.getByTitle(TITLE) as HTMLElement;
  expect(frame.tagName.toLowerCase()).toBe("iframe");

  const height = toPx(frame.style.height, viewportWidth);
  const minHeight = toPx(frame.style.minHeight, viewportWidth);
  const maxHeight = toPx(frame.style.maxHeight, viewportWidth);

  expect(height).not.toBeNull();
  let effective = height as number;
  if (maxHeight !== null) effective = Math.min(effective, maxHeight);
  if (minHeight !== null) effective = Math.max(effective, minHeight);

  expect(effective).toBe(520);
});
