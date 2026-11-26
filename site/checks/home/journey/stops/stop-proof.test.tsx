// ail-derived-from: StopProof@50150f2565dcacf4
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { StopProof } from "../../../../src/gen/home/journey/stops/stop-proof";

afterEach(() => {
  cleanup();
});

test("the proof", () => {
  const { container } = render(<StopProof />);

  const article = container.querySelector("#stop-7");
  expect(article).not.toBeNull();
  expect(article?.tagName.toLowerCase()).toBe("article");
  const stop = within(article as HTMLElement);

  expect(
    stop.getByRole("heading", {
      level: 3,
      name: "Proof: the verify line becomes a test that plays every game.",
    }),
  ).toBeTruthy();

  const region = stop.getByRole("region", { name: "Derived check excerpt" });
  const text = region.textContent ?? "";
  const lines = [
    "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20",
    "test(\"never loses\", () => {",
    "  …",
    "  explore(Array(9).fill(null), \"X\");",
    "  expect(games).toBeGreaterThan(0);",
    "  expect(xWins).toBe(0);",
    "});",
  ];
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(line, from);
    expect(at).toBeGreaterThanOrEqual(0);
    from = at + line.length;
  }

  const highlighted = Array.from(region.querySelectorAll("*")).filter(
    (el) => el.textContent === "never loses",
  );
  expect(highlighted.length).toBeGreaterThan(0);
});
