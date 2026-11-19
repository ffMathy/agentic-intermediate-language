// ail-derived-from: SpecBrowser@0993ef6ea6ad6a92
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

const ownPath = "home/sections/spec-browser.ail.md";

function setHash(hash: string): void {
  window.history.replaceState(null, "", hash === "" ? window.location.pathname : hash);
}

beforeEach(() => {
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = function scrollIntoView(): void {};
  }
  setHash("");
});

afterEach(() => {
  cleanup();
  setHash("");
  document.querySelectorAll("a[data-test-link]").forEach((a) => a.remove());
});

function pressed(name: string): string | null {
  return screen.getByRole("button", { name }).getAttribute("aria-pressed");
}

test("this section shows its own spec first", () => {
  render(<SpecBrowser />);
  expect(pressed("This website")).toBe("true");
  expect(pressed(ownPath)).toBe("true");
  const region = screen.getByRole("region", { name: `Source of ${ownPath}` });
  expect(region.textContent ?? "").toContain("node SpecBrowser : flow");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "site.ail.md" }));
  });
  expect(pressed("site.ail.md")).toBe("true");
  expect(pressed(ownPath)).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of site.ail.md" });
  expect(region.textContent ?? "").toContain("node AIL : system");
});

test("showing the demo", () => {
  const { container } = render(<SpecBrowser />);
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }));
  });
  expect(pressed("Tic-Tac-Toe demo")).toBe("true");
  expect(pressed("This website")).not.toBe("true");
  const demo = specProjects.find((p) => p.key === "tictactoe");
  expect(demo).toBeDefined();
  if (!demo) return;
  expect(pressed(demo.files[0].path)).toBe("true");
  const expected = `${demo.nodeCount} nodes in ${demo.files.length} files`;
  const found = Array.from(container.querySelectorAll("*")).some(
    (el) => (el.textContent ?? "").trim() === expected,
  );
  expect(found).toBe(true);
});

test("opened from a link", () => {
  setHash("#spec/tictactoe/app/play/play.ail.md");
  render(<SpecBrowser />);
  expect(pressed("Tic-Tac-Toe demo")).toBe("true");
  expect(pressed("app/play/play.ail.md")).toBe("true");
});

test("following the same link twice", () => {
  setHash("#spec/tictactoe/app/play/play.ail.md");
  render(<SpecBrowser />);
  expect(pressed("app/play/play.ail.md")).toBe("true");
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "tictactoe.ail.md" }));
  });
  expect(pressed("tictactoe.ail.md")).toBe("true");
  expect(pressed("app/play/play.ail.md")).not.toBe("true");
  const link = document.createElement("a");
  link.setAttribute("href", "#spec/tictactoe/app/play/play.ail.md");
  link.setAttribute("data-test-link", "");
  link.textContent = "play spec";
  document.body.appendChild(link);
  act(() => {
    fireEvent.click(link);
  });
  expect(pressed("app/play/play.ail.md")).toBe("true");
});
