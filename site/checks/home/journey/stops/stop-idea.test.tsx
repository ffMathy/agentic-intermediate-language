// ail-derived-from: StopIdea@11e907f9a9104e5e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopIdea } from "../../../../src/gen/home/journey/stops/stop-idea";

afterEach(() => {
  cleanup();
});

test("the idea", () => {
  render(<StopIdea />);

  const article = document.getElementById("stop-1");
  expect(article).not.toBeNull();
  if (article === null) {
    return;
  }
  const isArticle =
    article.tagName.toLowerCase() === "article" ||
    article.getAttribute("role") === "article";
  expect(isArticle).toBe(true);

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "It starts as a sentence anyone could say.",
  });
  expect(heading).toBeTruthy();

  const region = within(article).getByRole("region", {
    name: "The idea, at the top of the spec",
  });
  expect(screen.getByRole("region", { name: "The idea, at the top of the spec" })).toBe(region);

  const text = region.textContent ?? "";
  const lines = [
    "  why   A quick, familiar game people can finish in under a minute,",
    "        alone or with a friend on the same device.",
    "  …",
    "    4. The computer never loses.",
  ];
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === "The computer never loses.",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
