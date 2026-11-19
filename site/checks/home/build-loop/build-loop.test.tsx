// ail-derived-from: BuildLoop@492bd8aea16c819c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { BuildLoop } from "../../../src/gen/home/build-loop/build-loop";

afterEach(() => {
  cleanup();
});

test("four steps", () => {
  const { container } = render(<BuildLoop />);
  const section = container.querySelector("#loop");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;

  const list = within(band).getByRole("list");
  const items = within(list).getAllByRole("listitem");
  expect(items.length).toBe(4);
  const titles = items.map(
    (item) => within(item).getByRole("heading", { level: 3 }).textContent,
  );
  expect(titles).toEqual(["Write", "Build", "Check", "Ask"]);

  expect(band.textContent ?? "").toContain("Illustrative example.");
});
