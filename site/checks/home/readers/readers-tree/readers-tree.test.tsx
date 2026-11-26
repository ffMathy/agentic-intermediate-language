// ail-derived-from: ReadersTree@afe39a61f5698f80
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ReadersTree } from "../../../../src/gen/home/readers/readers-tree/readers-tree";

afterEach(() => {
  cleanup();
});

test("the stakeholder's level", () => {
  render(<ReadersTree reader="stakeholder" />);

  const images = screen.getAllByRole("img", {
    name: "The Tic-Tac-Toe spec tree, with the level written for the stakeholder highlighted",
  });
  expect(images.length).toBeGreaterThanOrEqual(1);

  const wide = images[0];
  const nodes = Array.from(wide.querySelectorAll("g[data-lit]"));
  expect(nodes.length).toBe(13);
  const lit = nodes.filter((g) => g.getAttribute("data-lit") === "true");
  expect(lit.length).toBe(1);
  expect((lit[0].textContent ?? "").trim()).toBe("TicTacToe");

  expect(
    screen.getByText("Simplified: the six parts inside BoardKit and UiKit are not drawn."),
  ).toBeTruthy();
});
