// ail-derived-from: Hero@56b3de1b61532fb2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "../../../src/gen/home/sections/hero";

afterEach(() => {
  cleanup();
});

test("the links go to the right places", () => {
  render(<Hero />);
  expect(screen.getByRole("link", { name: "Get started" }).getAttribute("href")).toBe("#get-started");
  expect(screen.getByRole("link", { name: "Try the demo" }).getAttribute("href")).toBe("./demo/");
  expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
});
