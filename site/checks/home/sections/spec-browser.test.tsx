// ail-derived-from: SpecBrowser@7aa9ffd0e229e5c4
import { afterEach, beforeEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

beforeEach(() => {
  if (typeof HTMLElement.prototype.scrollIntoView !== "function") {
    HTMLElement.prototype.scrollIntoView = () => {};
  }
});

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

function projectButton(name: string): HTMLElement {
  const group = screen.getByRole("group", { name: "Projects" });
  return within(group).getByRole("button", { name });
}

function fileButton(path: string): HTMLElement {
  const nav = screen.getByRole("navigation", { name: "Spec files" });
  return within(nav).getByRole("button", { name: path });
}

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expect(projectButton("Tic-Tac-Toe demo").getAttribute("aria-pressed")).toBe("true");
  expect(fileButton("tictactoe.ail.md").getAttribute("aria-pressed")).toBe("true");
  const region = screen.getByRole("region", { name: "Source of tictactoe.ail.md" });
  expect(region.textContent ?? "").toContain("node TicTacToe : system");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(fileButton("board/board.ail.md"));
  expect(fileButton("board/board.ail.md").getAttribute("aria-pressed")).toBe("true");
  expect(fileButton("tictactoe.ail.md").getAttribute("aria-pressed")).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of board/board.ail.md" });
  expect(region.textContent ?? "").toContain("node BoardView : view");
});

test("showing this website's spec", () => {
  render(<SpecBrowser />);
  fireEvent.click(projectButton("This website"));
  expect(projectButton("This website").getAttribute("aria-pressed")).toBe("true");
  const site = specProjects.find((p) => p.key === "site");
  expect(site).toBeDefined();
  if (!site) return;
  const first = site.files[0];
  expect(first).toBeDefined();
  if (!first) return;
  expect(fileButton(first.path).getAttribute("aria-pressed")).toBe("true");
  const expected = `${site.nodeCount} nodes in ${site.files.length} files`;
  const found = Array.from(document.body.querySelectorAll("*")).some(
    (el) => (el.textContent ?? "").trim() === expected,
  );
  expect(found).toBe(true);
});

test("opened from a link", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  expect(projectButton("Tic-Tac-Toe demo").getAttribute("aria-pressed")).toBe("true");
  expect(fileButton("app/play/play.ail.md").getAttribute("aria-pressed")).toBe("true");
});

test("following the same link twice", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(
    <>
      <SpecBrowser />
      <a href="#spec/tictactoe/app/play/play.ail.md">Open play</a>
    </>,
  );
  fireEvent.click(fileButton("tictactoe.ail.md"));
  expect(fileButton("tictactoe.ail.md").getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("link", { name: "Open play" }));
  expect(fileButton("app/play/play.ail.md").getAttribute("aria-pressed")).toBe("true");
});
