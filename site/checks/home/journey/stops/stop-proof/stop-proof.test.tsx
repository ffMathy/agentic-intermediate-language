// ail-derived-from: StopProof@4060f1ea0dfeaf7f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopProof } from "../../../../../src/gen/home/journey/stops/stop-proof/stop-proof";

afterEach(() => {
  cleanup();
});

test("the proof", () => {
  const { container } = render(<StopProof />);

  const article = container.querySelector("#stop-7");
  expect(article).not.toBeNull();
  if (!(article instanceof HTMLElement)) throw new Error("no stop-7 element");
  expect(article.tagName.toLowerCase()).toBe("article");

  const heading = within(article).getByRole("heading", {
    level: 3,
    name: "Proof: the verify line becomes a test that plays every game.",
  });
  expect(heading).toBeTruthy();

  const region = within(article).getByRole("region", {
    name: "Derived check excerpt",
  });
  const text = region.textContent ?? "";

  const lines = [
    "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20",
    "test(\"never loses\", () => {",
    "…",
    "explore(Array(9).fill(null), \"X\");",
    "expect(games).toBeGreaterThan(0);",
    "expect(xWins).toBe(0);",
    "});",
  ];
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "").trim() === "never loses",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
