// ail-derived-from: SectionHeading@2859a17e07a8ef82
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SectionHeading } from "../../src/gen/parts/section-heading";

afterEach(() => {
  cleanup();
});

test("a full heading", () => {
  render(
    <SectionHeading
      eyebrow="THE JOURNEY"
      text="Follow one sentence all the way down"
      lead="Read on."
    />,
  );
  const heading = screen.getByRole("heading", {
    level: 2,
    name: "Follow one sentence all the way down",
  });
  expect(heading.textContent).toBe("Follow one sentence all the way down");

  const eyebrow = screen.getByText("THE JOURNEY");
  const lead = screen.getByText("Read on.");

  expect(
    heading.compareDocumentPosition(eyebrow) &
      Node.DOCUMENT_POSITION_PRECEDING,
  ).toBeTruthy();
  expect(
    heading.compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("just a heading", () => {
  const { container } = render(<SectionHeading text="Start in two minutes" />);
  const heading = screen.getByRole("heading", {
    level: 2,
    name: "Start in two minutes",
  });
  expect(heading.textContent).toBe("Start in two minutes");
  expect(screen.getAllByRole("heading").length).toBe(1);
  expect(container.textContent).toBe("Start in two minutes");
});
