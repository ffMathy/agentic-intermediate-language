// ail-derived-from: SpecBrowser@8838cacf10d65b22
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

beforeEach(() => {
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
  window.location.hash = "";
});

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

function isPicked(name: string): boolean {
  return screen.getByRole("button", { name }).getAttribute("aria-pressed") === "true";
}

function regionContains(name: string, text: string): boolean {
  return screen
    .getAllByRole("region", { name })
    .some((region) => (region.textContent ?? "").includes(text));
}

function deepestWithText(text: string): Element[] {
  return Array.from(document.body.querySelectorAll("*")).filter(
    (el) =>
      (el.textContent ?? "").trim() === text &&
      !Array.from(el.children).some((child) => (child.textContent ?? "").trim() === text),
  );
}

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expect(isPicked("Tic-Tac-Toe demo")).toBe(true);
  expect(isPicked("tictactoe.ail.md")).toBe(true);
  expect(regionContains("Source of tictactoe.ail.md", "node TicTacToe : system")).toBe(true);
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "board/board-view.ail.md" }));
  expect(isPicked("board/board-view.ail.md")).toBe(true);
  expect(isPicked("tictactoe.ail.md")).toBe(false);
  expect(regionContains("Source of board/board-view.ail.md", "node BoardView : view")).toBe(true);
});

test("showing this website's spec", () => {
  const site = specProjects.find((p) => p.key === "site");
  expect(site).toBeDefined();
  if (!site) return;
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "This website" }));
  expect(isPicked("This website")).toBe(true);
  expect(isPicked(site.files[0].path)).toBe(true);
  const sizeText = `${site.nodeCount} nodes in ${site.files.length} files`;
  const sizeLines = Array.from(document.body.querySelectorAll("p")).filter((p) =>
    (p.textContent ?? "").trim().startsWith(sizeText),
  );
  expect(sizeLines.length).toBeGreaterThan(0);
});

test("a screenshot beside its spec", () => {
  render(<SpecBrowser />);
  const shotPath = "board/shots/board-view/01-picking-an-empty-square.png";
  fireEvent.click(screen.getByRole("button", { name: shotPath }));
  expect(isPicked(shotPath)).toBe(true);
  expect(
    screen.getByRole("img", {
      name: "Screenshot at the end of the check “picking an empty square”",
    }),
  ).toBeTruthy();
  const fileButton = screen.getByRole("button", { name: "board/board-view.ail.md" });
  const folders = deepestWithText("board/shots/board-view/");
  expect(folders.length).toBeGreaterThan(0);
  expect(
    folders.some(
      (folder) =>
        (fileButton.compareDocumentPosition(folder) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
    ),
  ).toBe(true);
});

test("opened from a link", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  expect(isPicked("Tic-Tac-Toe demo")).toBe(true);
  expect(isPicked("app/play/play.ail.md")).toBe(true);
});

test("the language is defined", () => {
  render(<SpecBrowser />);
  const section = document.getElementById("specs");
  expect(section).not.toBeNull();
  if (!section) return;
  const link = within(section).getByRole("link", { name: "the language definition" });
  expect(link.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md",
  );
});

test("following the same link twice", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "tictactoe.ail.md" }));
  expect(isPicked("tictactoe.ail.md")).toBe(true);
  const link = document.createElement("a");
  link.setAttribute("href", "#spec/tictactoe/app/play/play.ail.md");
  link.textContent = "Open play";
  document.body.appendChild(link);
  act(() => {
    fireEvent.click(link);
  });
  expect(isPicked("app/play/play.ail.md")).toBe(true);
  link.remove();
});
