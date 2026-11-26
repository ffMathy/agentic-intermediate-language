// ail-derived-from: StopProduct@33246c92786c2d83
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopProduct } from "../../../../../src/gen/home/journey/stops/stop-product/stop-product";

afterEach(() => {
  cleanup();
});

const lines: string[] = [
  "node TicTacToe : system   level: product",
  "  …",
  "  what",
  "    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame",
  "    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules",
  "    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent",
  "    4. The computer never loses.                                            refined-by: ComputerPlayer",
  "    5. You can start a new game at any time.                                refined-by: NewGameButton",
  "    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo",
  "  entry     App",
  "  children  App, BoardKit, Engine, UiKit",
];

test("the product level", () => {
  render(<StopProduct />);

  const article = screen
    .getAllByRole("article")
    .find((element) => element.id === "stop-2");
  expect(article).toBeDefined();
  if (!article) return;

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "Product level: each requirement becomes a promise with an owner.",
  });
  expect(heading).toBeTruthy();

  const region = screen.getByRole("region", {
    name: "Product-level spec excerpt",
  });
  const regionText = region.textContent ?? "";
  for (const line of lines) {
    expect(regionText).toContain(line);
  }

  const elements = Array.from(region.querySelectorAll("*"));
  const claim = elements.filter(
    (element) => element.textContent === "4. The computer never loses.",
  );
  const owner = elements.filter(
    (element) => element.textContent === "refined-by: ComputerPlayer",
  );
  expect(claim.length).toBeGreaterThan(0);
  expect(owner.length).toBeGreaterThan(0);
});
