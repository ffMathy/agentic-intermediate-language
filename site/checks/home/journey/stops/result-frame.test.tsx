// ail-derived-from: ResultFrame@cab77f7c5e7d918c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ResultFrame } from "../../../../src/gen/home/journey/stops/result-frame";

afterEach(() => {
  cleanup();
});

test("the game is embedded", () => {
  render(<ResultFrame />);

  const frame = screen.getByTitle("Tic-Tac-Toe, built from its AIL spec");
  expect(frame.tagName.toLowerCase()).toBe("iframe");
  expect(frame.getAttribute("src")).toBe("./demo/");

  const open = screen.getByRole("link", { name: "Open the game full screen ↗" });
  expect(open.getAttribute("href")).toBe("./demo/");

  const hint = screen.getByText("Pick “Computer”, then play as X");
  expect(hint.textContent).toBe("Pick “Computer”, then play as X");
});
