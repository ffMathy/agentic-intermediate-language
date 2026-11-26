// ail-derived-from: SamplePullRequest@74be26b846818a7b
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { SamplePullRequest } from "../../../src/gen/home/review/sample-pull-request";

afterEach(() => {
  cleanup();
});

test("the parts to review are open", () => {
  render(<SamplePullRequest />);
  const region = screen.getByRole("region", { name: "Sample pull request" });
  const text = region.textContent ?? "";
  expect(text).toContain("examples/tictactoe/ail/app/demo/demo.ail.md");
  expect(text).toContain("+    Scenario: watch again");

  const first = "Screenshot at the end of the check “perfect play ends in a draw”";
  const second = "Screenshot at the end of the check “watch again”";
  expect(within(region).getByRole("img", { name: first })).toBeTruthy();
  expect(within(region).getByRole("img", { name: second })).toBeTruthy();

  const names = within(region)
    .getAllByRole("img")
    .map((img) => img.getAttribute("alt") ?? img.getAttribute("aria-label") ?? "")
    .filter((name) => name === first || name === second);
  expect(names).toEqual([first, second]);
});

test("what the build wrote is collapsed", () => {
  render(<SamplePullRequest />);
  const region = screen.getByRole("region", { name: "Sample pull request" });
  const text = region.textContent ?? "";
  expect(text).toContain("examples/tictactoe/src/gen/app/demo/watch-a-demo.tsx");
  expect(text).toContain("examples/tictactoe/checks/app/demo/watch-a-demo.test.tsx");
  expect(text).toContain("examples/tictactoe/ail.lock.json");

  expect(text).not.toContain('from "react"');
  expect(text).not.toContain('from "bun:test"');
  expect(text).not.toContain("ail-derived-from");
  expect(text).not.toContain("export function");
});
