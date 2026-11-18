// ail-derived-from: Steps@166bc2a8fff4cb41
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Steps } from "../../../src/gen/home/sections/steps";

afterEach(() => {
  cleanup();
});

function precedes(a: HTMLElement, b: HTMLElement): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

test("the loop", () => {
  render(<Steps />);
  const one = screen.getByText("1");
  const spec = screen.getByText("Spec");
  const two = screen.getByText("2");
  const build = screen.getByText("Build");
  const three = screen.getByText("3");
  const check = screen.getByText("Check");
  const sequence = [one, spec, two, build, three, check];
  for (let i = 0; i < sequence.length - 1; i++) {
    expect(precedes(sequence[i], sequence[i + 1])).toBe(true);
  }
});
