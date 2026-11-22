// ail-derived-from: BuildLoop@ba28f5eff03b9226
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { BuildLoop } from "../../../src/gen/home/build-loop/build-loop";

afterEach(() => {
  cleanup();
});

test("four steps", () => {
  const { container } = render(<BuildLoop />);
  const section = container.querySelector("section#loop");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;

  const list = within(band).getByRole("list");
  const items = within(list).getAllByRole("listitem");
  expect(items.length).toBe(4);

  const titles = items.map((item) =>
    within(item).getByRole("heading", { level: 3 }).textContent?.trim(),
  );
  expect(titles).toEqual(["Write", "Build", "Check", "Ask"]);

  const text = band.textContent ?? "";
  expect(text).toContain("Example question.");
  expect(text).toContain("(see the GameReducer node)");
});
