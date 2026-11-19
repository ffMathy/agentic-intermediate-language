// ail-derived-from: ReadersTree@8bcd7311f3acebdd
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ReadersTree } from "../../../src/gen/home/readers/readers-tree";

afterEach(() => {
  cleanup();
});

test("the stakeholder's part", () => {
  render(<ReadersTree reader="stakeholder" />);

  const tree = screen.getByRole("img", {
    name: "The Tic-Tac-Toe spec tree, with what the stakeholder reads highlighted",
  });

  const nodes = Array.from(tree.querySelectorAll("g[data-lit]"));
  const lit = nodes.filter((node) => node.getAttribute("data-lit") === "true");

  expect(lit.length).toBe(1);
  expect((lit[0]?.textContent ?? "").trim()).toBe("TicTacToe");

  const ticTacToe = nodes.find(
    (node) => (node.textContent ?? "").trim() === "TicTacToe",
  );
  expect(ticTacToe).toBeDefined();
  expect(ticTacToe?.getAttribute("data-lit")).toBe("true");
});
