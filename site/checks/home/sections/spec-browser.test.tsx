// ail-derived-from: SpecBrowser@ee3b5dffbc8b4bdb
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

function resetHash(): void {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

beforeEach(() => {
  resetHash();
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = function scrollIntoView(): void {};
  }
});

afterEach(() => {
  cleanup();
  resetHash();
});

function isPicked(el: HTMLElement): boolean {
  return el.getAttribute("aria-pressed") === "true";
}

test("this section shows its own spec first", () => {
  render(<SpecBrowser />);
  const project = screen.getByRole("button", { name: "This website" });
  expect(isPicked(project)).toBe(true);
  const file = screen.getByRole("button", { name: "home/sections/spec-browser.ail.md" });
  expect(isPicked(file)).toBe(true);
  const region = screen.getByRole("region", { name: "Source of home/sections/spec-browser.ail.md" });
  expect(region.textContent ?? "").toContain("node SpecBrowser : flow");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "site.ail.md" }));
  });
  expect(isPicked(screen.getByRole("button", { name: "site.ail.md" }))).toBe(true);
  expect(isPicked(screen.getByRole("button", { name: "home/sections/spec-browser.ail.md" }))).toBe(false);
  const region = screen.getByRole("region", { name: "Source of site.ail.md" });
  expect(region.textContent ?? "").toContain("node AIL : system");
});

test("showing the demo", () => {
  const demo = specProjects.find((p) => p.key === "tictactoe");
  expect(demo).toBeDefined();
  if (!demo) return;
  const { container } = render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }));
  });
  expect(isPicked(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }))).toBe(true);
  expect(isPicked(screen.getByRole("button", { name: "This website" }))).toBe(false);
  const firstPath = demo.files[0].path;
  expect(isPicked(screen.getByRole("button", { name: firstPath }))).toBe(true);
  const expected = `${demo.nodeCount} nodes in ${demo.files.length} files`;
  const sizeLines = Array.from(container.querySelectorAll("p")).filter(
    (p) => (p.textContent ?? "").trim() === expected,
  );
  expect(sizeLines.length).toBe(1);
});

test("opened from a link", () => {
  window.location.hash = "#spec/tictactoe/app/play/play.ail.md";
  render(<SpecBrowser />);
  expect(isPicked(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }))).toBe(true);
  expect(isPicked(screen.getByRole("button", { name: "app/play/play.ail.md" }))).toBe(true);
});
