// ail-derived-from: StopProof@1090b5e6fb1f1cf4
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { StopProof } from "../../../../src/gen/home/journey/stops/stop-proof";

afterEach(() => {
  cleanup();
});

const lines = [
  "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20",
  "test(\"never loses\", () => {",
  "  …",
  "  explore(Array(9).fill(null), \"X\");",
  "  expect(games).toBeGreaterThan(0);",
  "  expect(xWins).toBe(0);",
  "});",
];

test("the proof", () => {
  const { container } = render(<StopProof />);

  const article = container.querySelector("article#stop-7");
  expect(article).not.toBeNull();
  const art = article as HTMLElement;

  const heading = within(art).getByRole("heading", {
    level: 3,
    name: "Proof: the verify line becomes a test that plays every game.",
  });
  expect(heading).toBeTruthy();

  const region = within(art).getByRole("region", { name: "Derived check excerpt" });
  const text = region.textContent ?? "";
  for (const line of lines) {
    expect(text).toContain(line.trim());
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => (el.textContent ?? "") === "never loses",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
