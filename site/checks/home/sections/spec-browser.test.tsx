// ail-derived-from: SpecBrowser@6ac3a22257405167
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

const LANGUAGE_URL =
  "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md";

beforeEach(() => {
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = function scrollIntoView(): void {};
  }
});

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

function pressed(name: string): string | null {
  return screen.getByRole("button", { name }).getAttribute("aria-pressed");
}

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expect(pressed("Tic-Tac-Toe demo")).toBe("true");
  expect(pressed("tictactoe.ail.md")).toBe("true");
  const region = screen.getByRole("region", { name: "Source of tictactoe.ail.md" });
  expect(region.textContent ?? "").toContain("node TicTacToe : system");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "board/board.ail.md" }));
  expect(pressed("board/board.ail.md")).toBe("true");
  expect(pressed("tictactoe.ail.md")).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of board/board.ail.md" });
  expect(region.textContent ?? "").toContain("node BoardView : view");
});

test("showing this website's spec", () => {
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "This website" }));
  expect(pressed("This website")).toBe("true");
  const site = specProjects.find((p) => p.key === "site");
  expect(site).toBeDefined();
  if (!site) return;
  const firstPath = site.files[0].path;
  expect(pressed(firstPath)).toBe("true");
  const expected = `${site.nodeCount} nodes in ${site.files.length} files`;
  const section = document.getElementById("specs");
  expect(section).not.toBeNull();
  const found = Array.from(section?.querySelectorAll("*") ?? []).some(
    (el) => (el.textContent ?? "").trim() === expected,
  );
  expect(found).toBe(true);
});

test("opened from a link", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  expect(pressed("Tic-Tac-Toe demo")).toBe("true");
  expect(pressed("app/play/play.ail.md")).toBe("true");
});

test("the language is defined", () => {
  render(<SpecBrowser />);
  const section = document.getElementById("specs");
  expect(section).not.toBeNull();
  if (!section) return;
  const link = within(section).getByRole("link", { name: "the language definition" });
  expect(link.getAttribute("href")).toBe(LANGUAGE_URL);
});

test("following the same link twice", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "tictactoe.ail.md" }));
  expect(pressed("tictactoe.ail.md")).toBe("true");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "#spec/tictactoe/app/play/play.ail.md");
  anchor.textContent = "Open play";
  document.body.appendChild(anchor);
  try {
    act(() => {
      fireEvent.click(anchor);
    });
    expect(pressed("app/play/play.ail.md")).toBe("true");
  } finally {
    anchor.remove();
  }
});
