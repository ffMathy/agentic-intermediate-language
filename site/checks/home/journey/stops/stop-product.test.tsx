// ail-derived-from: StopProduct@746e66676962a60d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopProduct } from "../../../../src/gen/home/journey/stops/stop-product";

afterEach(() => {
  cleanup();
});

const lines = [
  "node TicTacToe : system   level: product",
  "  what",
  "    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame",
  "    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules",
  "    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent",
  "    4. The computer never loses.                                            refined-by: ComputerPlayer",
  "    5. You can start a new game at any time.                                refined-by: NewGameButton",
  "    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo",
  "  children  App, BoardKit, Engine, UiKit",
];

const marks = ["4. The computer never loses.", "refined-by: ComputerPlayer"];

test("the product level", () => {
  render(<StopProduct />);

  const article = screen.getAllByRole("article").find((a) => a.id === "stop-2");
  expect(article).toBeDefined();
  const stop = article as HTMLElement;

  expect(
    within(stop).getByRole("heading", {
      level: 3,
      name: "Product level: the sentence becomes a promise with an owner.",
    }),
  ).toBeTruthy();

  const region = within(stop).getByRole("region", { name: "Product-level spec excerpt" });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line);
  }

  for (const mark of marks) {
    const highlighted = Array.from(region.querySelectorAll("*")).filter(
      (el) => el.textContent === mark,
    );
    expect(highlighted.length).toBeGreaterThan(0);
  }
});
