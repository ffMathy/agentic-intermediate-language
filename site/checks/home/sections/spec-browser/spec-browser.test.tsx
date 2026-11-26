// ail-derived-from: SpecBrowser@05f13ac001dc5cb1
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../../src/gen/home/sections/spec-browser/spec-browser";
import { specProjects } from "../../../../src/gen/spec";

const LANGUAGE_URL =
  "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md";

function setHash(hash: string): void {
  window.location.hash = hash;
}

function specsSection(container: HTMLElement): HTMLElement {
  const section = container.querySelector("#specs");
  if (!(section instanceof HTMLElement)) {
    throw new Error("no element with the id \"specs\"");
  }
  return section;
}

function elementWithText(root: HTMLElement, text: string): HTMLElement {
  const matches = Array.from(root.querySelectorAll("*")).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      el.closest("select") === null &&
      (el.textContent ?? "").trim() === text,
  );
  const deepest = matches.filter(
    (el) => !matches.some((other) => other !== el && el.contains(other)),
  );
  if (deepest.length === 0) {
    throw new Error(`no element reads "${text}"`);
  }
  return deepest[0];
}

function expectPicked(name: string): void {
  expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
}

function expectNotPicked(name: string): void {
  expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).not.toBe("true");
}

beforeEach(() => {
  setHash("");
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = function scrollIntoView(): void {};
  }
});

afterEach(() => {
  cleanup();
  setHash("");
});

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expectPicked("Tic-Tac-Toe demo");
  expectPicked("tictactoe.ail.md");
  const region = screen.getByRole("region", { name: "Source of tictactoe.ail.md" });
  expect(region.textContent ?? "").toContain("node TicTacToe : system");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "board/board-view/board-view.ail.md" }));
  });
  expectPicked("board/board-view/board-view.ail.md");
  expectNotPicked("tictactoe.ail.md");
  const region = screen.getByRole("region", {
    name: "Source of board/board-view/board-view.ail.md",
  });
  expect(region.textContent ?? "").toContain("node BoardView : view");
});

test("showing this website's spec", () => {
  const site = specProjects.find((p) => p.key === "site");
  if (!site) {
    throw new Error("no project with the key \"site\"");
  }
  const { container } = render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "This website" }));
  });
  expectPicked("This website");
  expectNotPicked("Tic-Tac-Toe demo");
  expectPicked(site.files[0].path);
  expect(specsSection(container).textContent ?? "").toContain(
    `${site.nodeCount} nodes in ${site.files.length} files`,
  );
});

test("a screenshot beside its spec", () => {
  const { container } = render(<SpecBrowser />);
  act(() => {
    fireEvent.click(
      screen.getByRole("button", { name: "board/board-view/shots/01-picking-an-empty-square.png" }),
    );
  });
  expectPicked("board/board-view/shots/01-picking-an-empty-square.png");
  expect(
    screen.getByRole("img", {
      name: "Screenshot at the end of the check “picking an empty square”",
    }),
  ).toBeTruthy();
  const file = screen.getByRole("button", { name: "board/board-view/board-view.ail.md" });
  const folder = elementWithText(specsSection(container), "board/board-view/shots/");
  expect(file.compareDocumentPosition(folder) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("opened from a link", () => {
  setHash("#spec/tictactoe/app/play/play.ail.md");
  render(<SpecBrowser />);
  expectPicked("Tic-Tac-Toe demo");
  expectPicked("app/play/play.ail.md");
});

test("the language is defined", () => {
  const { container } = render(<SpecBrowser />);
  const link = within(specsSection(container)).getByRole("link", {
    name: "the language definition",
  });
  expect(link.getAttribute("href")).toBe(LANGUAGE_URL);
});

test("following the same link twice", () => {
  setHash("#spec/tictactoe/app/play/play.ail.md");
  render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "tictactoe.ail.md" }));
  });
  expectPicked("tictactoe.ail.md");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "#spec/tictactoe/app/play/play.ail.md");
  anchor.textContent = "Open play";
  document.body.appendChild(anchor);
  try {
    act(() => {
      fireEvent.click(anchor);
    });
    expectPicked("app/play/play.ail.md");
  } finally {
    anchor.remove();
  }
});
