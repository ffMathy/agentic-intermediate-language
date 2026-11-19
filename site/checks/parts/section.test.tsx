// ail-derived-from: Section@76436e4cfd722dc1
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Section } from "../../src/gen/parts/section";

afterEach(() => {
  cleanup();
});

test("an anchored band", () => {
  const { container } = render(
    <Section id="journey" tone="plain">
      Hello
    </Section>,
  );
  const band = container.querySelector("#journey");
  expect(band).not.toBeNull();
  expect(band?.tagName.toLowerCase()).toBe("section");
  expect(band?.textContent ?? "").toContain("Hello");
});
