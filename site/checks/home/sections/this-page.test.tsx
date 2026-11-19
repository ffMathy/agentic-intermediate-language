// ail-derived-from: ThisPage@873aedaa163d6de1
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThisPage } from "../../../src/gen/home/sections/this-page";
import { specFiles, specNodes } from "../../../src/gen/spec";

afterEach(() => {
  cleanup();
});

test("this section shows its own spec first", () => {
  render(<ThisPage />);
  const own = screen.getByRole("button", { name: "home/sections/this-page.ail.md" });
  expect(own.getAttribute("aria-pressed")).toBe("true");
  const region = screen.getByRole("region", {
    name: "Source of home/sections/this-page.ail.md",
  });
  expect(region.textContent ?? "").toContain("node ThisPage : flow");
});

test("picking another file", () => {
  render(<ThisPage />);
  fireEvent.click(screen.getByRole("button", { name: "site.ail.md" }));
  expect(
    screen.getByRole("button", { name: "site.ail.md" }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "home/sections/this-page.ail.md" })
      .getAttribute("aria-pressed"),
  ).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of site.ail.md" });
  expect(region.textContent ?? "").toContain("node AIL : system");
});

test("the size comes from the spec", () => {
  const { container } = render(<ThisPage />);
  const expected = `${specNodes.length} nodes in ${specFiles.length} files`;
  const paragraphs = Array.from(container.querySelectorAll("p"));
  const match = paragraphs.find(
    (p) => (p.textContent ?? "").replace(/\s+/g, " ").trim() === expected,
  );
  expect(match).toBeDefined();
});
