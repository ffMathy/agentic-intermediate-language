// ail-derived-from: BuildLoop@2640cc7359d0ae68
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

  const items = within(band).getAllByRole("listitem");
  const titles = items.map((item) =>
    within(item)
      .getAllByRole("heading", { level: 3 })
      .map((h) => (h.textContent ?? "").trim())
      .join(""),
  );
  expect(titles).toEqual(["Write", "Build", "Check", "Ask"]);

  const text = band.textContent ?? "";
  expect(text).toContain("Example question.");
  expect(text).toContain("(see the GameReducer node)");
});
