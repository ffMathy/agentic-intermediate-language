// ail-derived-from: HomePage@26413adb142f24b0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HomePage } from "../../src/gen/home/home-page";

afterEach(() => {
  cleanup();
});

test("everything is on one page", () => {
  render(<HomePage />);
  const headings = screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent?.trim());
  expect(headings).toEqual([
    "Spec, build, check",
    "What a spec looks like",
    "Get started",
    "Three commands",
  ]);
});
