// ail-derived-from: GapStrip@739d15d0dd78039e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { GapStrip } from "../../../src/gen/home/sections/gap-strip";

afterEach(() => {
  cleanup();
});

test("three cards", () => {
  const { container } = render(<GapStrip />);
  const section = within(container);

  const heading = section.getByRole("heading", {
    level: 2,
    name: "Between a prompt and the code, there is nothing to review.",
  });
  const eyebrow = section.getByText("THE PROBLEM");
  expect(
    eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();

  const titles = section
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  expect(titles).toEqual([
    "A prompt is too vague",
    "Code is too detailed",
    "AIL is the layer in between",
  ]);
});
