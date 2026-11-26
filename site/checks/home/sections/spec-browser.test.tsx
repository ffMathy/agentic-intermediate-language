// ail-derived-from: SpecBrowser@f8842ef1e833024b
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

const clearHash = (): void => {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
};

beforeEach(() => {
  clearHash();
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(() => {
  cleanup();
  clearHash();
});

const pressed = (el: HTMLElement): string | null => el.getAttribute("aria-pressed");

const fileButton = (path: string): HTMLElement => screen.getByRole("button", { name: path });

const folderRow = (folder: string): HTMLElement => {
  const matches = screen.getAllByText((_content, el) => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "option" || tag === "optgroup" || tag === "select") return false;
    if (el.textContent !== folder) return false;
    return !Array.from(el.children).some((child) => child.textContent === folder);
  });
  return matches[0];
};

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expect(pressed(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }))).toBe("true");
  expect(pressed(fileButton("tictactoe.ail.md"))).toBe("true");
  const region = screen.getByRole("region", { name: "Source of tictactoe.ail.md" });
  expect(region.textContent ?? "").toContain("node TicTacToe : system");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(fileButton("board/board.ail.md"));
  expect(pressed(fileButton("board/board.ail.md"))).toBe("true");
  expect(pressed(fileButton("tictactoe.ail.md"))).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of board/board.ail.md" });
  expect(region.textContent ?? "").toContain("node BoardView : view");
});

test("showing this website's spec", () => {
  const { container } = render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "This website" }));
  expect(pressed(screen.getByRole("button", { name: "This website" }))).toBe("true");
  expect(pressed(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }))).not.toBe("true");
  const site = specProjects.find((p) => p.key === "site");
  expect(site).toBeDefined();
  if (!site) return;
  expect(pressed(fileButton(site.files[0].path))).toBe("true");
  expect(container.textContent ?? "").toContain(
    `${site.nodeCount} nodes in ${site.files.length} files`,
  );
});

test("a screenshot beside its spec", () => {
  render(<SpecBrowser />);
  const shotPath = "board/shots/board-view/01-picking-an-empty-square.png";
  fireEvent.click(fileButton(shotPath));
  expect(pressed(fileButton(shotPath))).toBe("true");
  expect(
    screen.getByRole("img", {
      name: "Screenshot at the end of the check “picking an empty square”",
    }),
  ).toBeTruthy();
  const boardFile = fileButton("board/board.ail.md");
  const folder = folderRow("board/shots/board-view/");
  expect(boardFile.compareDocumentPosition(folder) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("opened from a link", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  expect(pressed(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }))).toBe("true");
  expect(pressed(fileButton("app/play/play.ail.md"))).toBe("true");
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
  fireEvent.click(fileButton("tictactoe.ail.md"));
  expect(pressed(fileButton("tictactoe.ail.md"))).toBe("true");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "#spec/tictactoe/app/play/play.ail.md");
  anchor.textContent = "Open play";
  document.body.appendChild(anchor);
  try {
    act(() => {
      fireEvent.click(anchor);
    });
    expect(pressed(fileButton("app/play/play.ail.md"))).toBe("true");
  } finally {
    anchor.remove();
  }
});
