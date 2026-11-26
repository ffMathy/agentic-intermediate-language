// ail-derived-from: ReviewSection@7571f0d5d514678a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { ReviewSection } from "../../../src/gen/home/review/review-section";

afterEach(() => {
  cleanup();
});

test("what a reviewer reads", () => {
  const { container } = render(<ReviewSection />);
  const section = container.querySelector("#review");
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);
  expect(
    scope.getByRole("heading", {
      level: 2,
      name: "Review the spec and the screens. That's all.",
    }),
  ).toBeTruthy();
  expect(scope.getByRole("region", { name: "Sample pull request" })).toBeTruthy();
});
