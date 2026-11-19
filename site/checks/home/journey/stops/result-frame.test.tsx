// ail-derived-from: ResultFrame@4abad12098bccc27
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ResultFrame } from "../../../../src/gen/home/journey/stops/result-frame";

const TITLE = "Tic-Tac-Toe, built from its AIL spec";

type HappyWindow = Window & {
  happyDOM?: { setViewport: (size: { width: number; height: number }) => void };
};

function setViewportWidth(width: number): void {
  const w = window as HappyWindow;
  if (w.happyDOM && typeof w.happyDOM.setViewport === "function") {
    w.happyDOM.setViewport({ width, height: 812 });
  } else {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: width,
    });
  }
  window.dispatchEvent(new Event("resize"));
}

afterEach(() => {
  cleanup();
  setViewportWidth(1024);
});

test("the game is embedded", () => {
  render(<ResultFrame />);

  const frames = screen.getAllByTitle(TITLE);
  const iframes = frames.filter((el) => el.tagName.toLowerCase() === "iframe");
  expect(iframes.length).toBeGreaterThan(0);
  for (const frame of iframes) {
    expect(frame.getAttribute("src")).toBe("./demo/");
  }

  const link = screen.getByRole("link", { name: "Open the game full screen ↗" });
  expect(link.getAttribute("href")).toBe("./demo/");

  const hint = screen.getByText("Pick “Computer”, then play as X");
  expect(hint.textContent).toBe("Pick “Computer”, then play as X");
});

test("the game fits a phone", () => {
  setViewportWidth(375);
  render(<ResultFrame />);

  const iframes = screen
    .getAllByTitle(TITLE)
    .filter((el) => el.tagName.toLowerCase() === "iframe");
  expect(iframes.length).toBeGreaterThan(0);
  const heights = iframes.map((el) => (el as HTMLElement).style.height);
  expect(heights).toContain("520px");
});
