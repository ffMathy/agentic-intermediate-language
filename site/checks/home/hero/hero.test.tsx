// ail-derived-from: Hero@1d9c90c31196a946
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "../../../src/gen/home/hero/hero";

afterEach(() => {
  cleanup();
});

test("the links go to the right places", () => {
  render(<Hero />);

  const follow = screen.getByRole("link", { name: "Follow the sentence ↓" });
  expect(follow.getAttribute("href")).toBe("#journey");

  const play = screen.getByRole("link", { name: "Try to beat the computer ↓" });
  expect(play.getAttribute("href")).toBe("#stop-8");

  const github = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(github.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
});
