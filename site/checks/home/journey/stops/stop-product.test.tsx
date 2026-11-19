// ail-derived-from: StopProduct@47afee876beb37a0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopProduct } from "../../../../src/gen/home/journey/stops/stop-product";

afterEach(() => {
  cleanup();
});

const lines = [
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

const marks = ["4. The computer never loses.", "refined-by: ComputerPlayer"];

test("the product level", () => {
  const { container } = render(<StopProduct />);
  const article = container.querySelector("#stop-2");
  expect(article).not.toBeNull();
  const el = article as HTMLElement;
  const isArticle =
    el.tagName.toLowerCase() === "article" || el.getAttribute("role") === "article";
  expect(isArticle).toBe(true);

  within(el).getByRole("heading", {
    level: 3,
    name: "Product level: each requirement becomes a promise with an owner.",
  });

  const region = within(el).getByRole("region", { name: "Product-level spec excerpt" });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line);
  }

  for (const mark of marks) {
    const highlighted = Array.from(region.querySelectorAll("*")).filter(
      (node) => (node.textContent ?? "").trim() === mark,
    );
    expect(highlighted.length).toBeGreaterThan(0);
  }
});
