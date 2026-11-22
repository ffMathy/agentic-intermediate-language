// ail-derived-from: WalkInset@1d0083a6c0b3e493
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkInset } from "../../../src/gen/home/watch/walk-inset";
import type { Inset } from "../../../src/gen/home/watch/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

function textBefore(container: HTMLElement, target: Node): string {
  const doc = container.ownerDocument;
  const walker = doc.createTreeWalker(container, 4);
  let out = "";
  let node = walker.nextNode();
  while (node) {
    if (node.compareDocumentPosition(target) & 4) {
      out += node.textContent ?? "";
    }
    node = walker.nextNode();
  }
  return out;
}

function precedes(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & 4) !== 0;
}

test("a card", () => {
  const inset: Inset = {
    kind: "card",
    label: "Compile context: WatchADemo",
    lines: ["Target, design tokens, glossary", "Why chain: TicTacToe → App"],
  };
  render(<WalkInset inset={inset} />);
  const label = screen.getByText("Compile context: WatchADemo");
  const first = screen.getByText("Target, design tokens, glossary");
  const second = screen.getByText("Why chain: TicTacToe → App");
  expect(first).not.toBe(second);
  expect(first.contains(second)).toBe(false);
  expect(second.contains(first)).toBe(false);
  expect(precedes(label, first)).toBe(true);
  expect(precedes(first, second)).toBe(true);
});

test("a screenshot", () => {
  const inset: Inset = {
    kind: "shot",
    node: "PlayAGame",
    test: "winning",
    label: "Your app today · localhost:3000",
    verdict: "MATCHES",
  };
  const { container } = render(<WalkInset inset={inset} />);
  const image = screen.getByRole("img", {
    name: "Screenshot of the app at the end of the check “winning”",
  });
  const before = textBefore(container, image);
  expect(before).toContain("Your app today · localhost:3000");
  expect(before).toContain("MATCHES");
});

test("nothing", () => {
  const inset: Inset = { kind: "none" };
  const { container } = render(<WalkInset inset={inset} />);
  expect(container.innerHTML).toBe("");
});
