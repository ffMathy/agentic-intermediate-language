// ail-derived-from: WatchSection@f9c9132d79f403e0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { WatchSection } from "../../../src/gen/home/watch/watch-section";

afterEach(() => {
  cleanup();
});

test("the section", () => {
  const { container } = render(<WatchSection />);
  const section = container.querySelector("#watch");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;
  const heading = within(band).getByRole("heading", {
    level: 2,
    name: "Watch AIL build, and adopt",
  });
  expect(heading).toBeTruthy();
  const eyebrow = within(band).getByText("SEE IT RUN");
  expect(eyebrow.contains(heading)).toBe(false);
  const position = heading.compareDocumentPosition(eyebrow);
  expect(position & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
});
