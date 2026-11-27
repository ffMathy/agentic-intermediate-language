// ail-derived-from: WalkInset@b77103613a42b815
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkInset } from "../../../../../../src/gen/home/watch/walkthrough-player/walk-picture/walk-inset/walk-inset";
import { specProjects } from "../../../../../../src/gen/spec";

afterEach(() => {
  cleanup();
});

function precedes(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

test("a card", () => {
  render(
    <WalkInset
      inset={{
        kind: "card",
        label: "Compile context: WatchADemo",
        lines: ["Target, design tokens, glossary", "Why chain: TicTacToe → App"],
      }}
    />,
  );
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
  render(
    <WalkInset
      inset={{
        kind: "shot",
        node: "PlayAGame",
        test: "winning",
        label: "Your app today · localhost:3000",
        verdict: "MATCHES",
      }}
    />,
  );
  const image = screen.getByRole("img", {
    name: "Screenshot of the app at the end of the check “winning”",
  });
  const project = specProjects.find((p) => p.key === "tictactoe");
  const shots = (project?.shots ?? []).filter(
    (s) => s.node === "PlayAGame" && s.test === "winning",
  );
  const shot = shots[shots.length - 1];
  expect(shot).toBeDefined();
  expect(image.getAttribute("src")).toBe(shot?.src ?? "");
  const label = screen.getByText("Your app today · localhost:3000");
  const verdict = screen.getByText("MATCHES");
  expect(precedes(label, image)).toBe(true);
  expect(precedes(verdict, image)).toBe(true);
});

test("nothing", () => {
  const { container } = render(<WalkInset inset={{ kind: "none" }} />);
  expect(container.innerHTML).toBe("");
});
