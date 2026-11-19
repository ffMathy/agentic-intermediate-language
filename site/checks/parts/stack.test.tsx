// ail-derived-from: Stack@40d5042667ae068e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Stack } from "../../src/gen/parts/stack";

afterEach(() => {
  cleanup();
});

test("children keep their order", () => {
  render(
    <Stack dir="v">
      <span>a</span>
      <span>b</span>
      <span>c</span>
    </Stack>,
  );
  const a = screen.getByText("a");
  const b = screen.getByText("b");
  const c = screen.getByText("c");
  expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(b.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(a.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
