// ail-derived-from: SpecSample@fb708e8e1bb5f20b
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecSample } from "../../../src/gen/home/sections/spec-sample";

afterEach(() => {
  cleanup();
});

const sampleLines = [
  "node TicTacToe : system   level: product",
  "  why   A quick, familiar game people can finish in under a minute.",
  "  what",
  "    1. Two players take turns placing their mark.   refined-by: PlayAGame",
  "    4. The computer never loses.                    refined-by: ComputerPlayer",
  "    6. You can watch the computer play itself.      refined-by: WatchADemo",
  "  children  App, BoardKit, Engine",
];

test("the sample is shown exactly", () => {
  render(<SpecSample />);
  const block = screen.getByRole("region", { name: "Sample spec" });
  expect(block.textContent).toBe(sampleLines.join("\n"));
});
