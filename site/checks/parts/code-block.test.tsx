// ail-derived-from: CodeBlock@f09b31c2b325b97a
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  expect(region.textContent).toBe("a  b\n  c");
});
