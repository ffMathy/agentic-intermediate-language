// ail-derived-from: Hero@ea56db8b65a4f0d0
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
