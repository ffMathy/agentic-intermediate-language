// ail-derived-from: Hero@04d878f3482ff3d5
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

  const play = screen.getByRole("link", { name: "Play the finished game" });
  expect(play.getAttribute("href")).toBe("./demo/");

  const github = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(github.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
});
