// ail-derived-from: SpecBrowser@39e5bfb2b50a1609
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

const scrollTarget = Element.prototype as unknown as { scrollIntoView?: () => void };
if (typeof scrollTarget.scrollIntoView !== "function") {
  scrollTarget.scrollIntoView = () => {};
}

function clearHash(): void {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

beforeEach(() => {
  clearHash();
});

afterEach(() => {
  cleanup();
  clearHash();
});

function expectPressed(name: string, pressed: boolean): void {
  expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe(pressed ? "true" : "false");
}

test("this section shows its own spec first", () => {
  render(<SpecBrowser />);
  expectPressed("This website", true);
  expectPressed("home/sections/spec-browser.ail.md", true);
  const region = screen.getByRole("region", { name: "Source of home/sections/spec-browser.ail.md" });
  expect(region.textContent ?? "").toContain("node SpecBrowser : flow");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "site.ail.md" }));
  expectPressed("site.ail.md", true);
  expectPressed("home/sections/spec-browser.ail.md", false);
  const region = screen.getByRole("region", { name: "Source of site.ail.md" });
  expect(region.textContent ?? "").toContain("node AIL : system");
});

test("showing the demo", () => {
  const demo = specProjects.find((p) => p.key === "tictactoe");
  expect(demo).toBeDefined();
  if (!demo) return;
  const { container } = render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }));
  expectPressed("Tic-Tac-Toe demo", true);
  expectPressed("This website", false);
  expectPressed(demo.files[0].path, true);
  const expected = `${demo.nodeCount} nodes in ${demo.files.length} files`;
  const lines = Array.from(container.querySelectorAll("p")).map((p) => (p.textContent ?? "").trim());
  expect(lines).toContain(expected);
});

test("opened from a link", async () => {
  window.history.replaceState(null, "", "#spec/tictactoe/app/play/play.ail.md");
  await act(async () => {
    render(<SpecBrowser />);
  });
  await waitFor(() => {
    expectPressed("Tic-Tac-Toe demo", true);
    expectPressed("app/play/play.ail.md", true);
  });
});
