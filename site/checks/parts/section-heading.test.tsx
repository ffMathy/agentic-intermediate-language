// ail-derived-from: SectionHeading@6abf2fdd4c8255a0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SectionHeading } from "../../src/gen/parts/section-heading";

afterEach(() => {
  cleanup();
});

test("a heading", () => {
  render(<SectionHeading text="Get started" id="get-started" />);
  const heading = screen.getByRole("heading", { level: 2, name: "Get started" });
  expect(heading.textContent).toBe("Get started");
  const target = document.getElementById("get-started");
  expect(target).not.toBeNull();
  expect(target === heading || (target !== null && target.contains(heading))).toBe(true);
});
