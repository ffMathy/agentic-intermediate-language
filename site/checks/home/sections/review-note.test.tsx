// ail-derived-from: ReviewNote@3b01e7c64accea4b
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ReviewNote } from "../../../src/gen/home/sections/review-note";

afterEach(() => {
  cleanup();
});

test("generated code stays out of review", () => {
  render(<ReviewNote />);
  const region = screen.getByRole("region", {
    name: "Review the spec, not the generated code",
  });
  const texts = Array.from(region.querySelectorAll("*")).map(
    (el) => el.textContent ?? "",
  );
  for (const line of [
    "src/gen/** linguist-generated=true",
    "ail.lock.json linguist-generated=true",
  ]) {
    expect(region.textContent ?? "").toContain(line);
    expect(texts.some((t) => t === line)).toBe(true);
  }
});
