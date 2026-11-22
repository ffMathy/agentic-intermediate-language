// ail-derived-from: WalkTerminal@da52da7ea81874d9
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkTerminal } from "../../../src/gen/home/watch/walk-terminal";

afterEach(() => {
  cleanup();
});

test("lines kept exactly", () => {
  render(
    <WalkTerminal
      place="terminal · examples/tictactoe"
      lines={["$ ail build", "✓ spec     no errors"]}
      caret={false}
    />,
  );
  const region = screen.getByRole("region", { name: "Terminal output" });
  const lines = Array.from(region.children);
  expect(lines.length).toBe(2);
  expect(lines[0].textContent).toBe("$ ail build");
  expect(lines[1].textContent).toBe("✓ spec     no errors");
  const prompt = lines[0].querySelector('[data-part="prompt"]');
  expect(prompt).not.toBeNull();
  expect(prompt?.textContent).toBe("$ ");
});

test("the caret", () => {
  const { container } = render(
    <WalkTerminal
      place="terminal · examples/tictactoe"
      lines={["· App: deriving checks from its scenarios"]}
      caret={true}
    />,
  );
  const carets = container.querySelectorAll('[data-part="caret"]');
  expect(carets.length).toBe(1);
  const region = screen.getByRole("region", { name: "Terminal output" });
  const lines = Array.from(region.children);
  expect(lines.length).toBe(1);
  const line = lines[0];
  const caret = carets[0];
  expect(line.contains(caret)).toBe(true);
  expect(line.lastChild).toBe(caret);
  expect(line.textContent).toBe("· App: deriving checks from its scenarios");
});

test("nothing printed", () => {
  render(
    <WalkTerminal
      place="terminal · examples/tictactoe"
      lines={[]}
      caret={false}
    />,
  );
  expect(screen.getByText("Nothing is printed in this chapter.")).toBeTruthy();
});
