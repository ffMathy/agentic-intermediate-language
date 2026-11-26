// ail-derived-from: Text@1c1f6cbeb628c2c0
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Text } from "../../../src/gen/ui/text/text";

afterEach(() => {
  cleanup();
});

test("content is shown", () => {
  const { container } = render(<Text variant="status">X wins!</Text>);
  expect(screen.getByText("X wins!")).toBeTruthy();
  expect(container.textContent).toBe("X wins!");
});
