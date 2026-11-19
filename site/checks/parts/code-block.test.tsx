// ail-derived-from: CodeBlock@11939f6ee6fab25e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

function lineElements(region: HTMLElement): HTMLElement[] {
  return Array.from(region.children) as HTMLElement[];
}

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  const lines = lineElements(region);
  expect(lines.length).toBe(2);
  expect(lines[0].textContent).toBe("a  b");
  expect(lines[1].textContent).toBe("  c");
  for (const line of lines) {
    expect(line.style.display).toBe("block");
  }
  expect(region.textContent).toBe("a  b  c");
  expect(region.style.whiteSpace).toBe("pre-wrap");
});

test("the thread is marked", () => {
  render(
    <CodeBlock
      lines={["4. The computer never loses.", "5. New game"]}
      label="Sample"
      highlight={["never loses"]}
    />,
  );
  const region = screen.getByRole("region", { name: "Sample" });
  const marks = Array.from(region.querySelectorAll("mark"));
  expect(marks.length).toBe(1);
  expect(marks[0].textContent).toBe("never loses");
  const lines = lineElements(region);
  expect(lines[0].textContent).toBe("4. The computer never loses.");
  expect(lines[1].textContent).toBe("5. New game");
});

test("a caption", () => {
  render(
    <CodeBlock
      lines={["a"]}
      label="Sample"
      caption="examples/tictactoe/tictactoe.ail.md"
    />,
  );
  const region = screen.getByRole("region", { name: "Sample" });
  const caption = screen.getByText("examples/tictactoe/tictactoe.ail.md");
  expect(region.contains(caption)).toBe(false);
  expect(
    region.compareDocumentPosition(caption) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("a long line wraps under itself", () => {
  const text =
    "    because an instant answer feels like the player's own move did nothing";
  const { container } = render(
    <div style={{ width: "30ch" }}>
      <CodeBlock lines={[text]} label="Sample" />
    </div>,
  );
  expect(container).toBeTruthy();
  const region = screen.getByRole("region", { name: "Sample" });
  expect(region.textContent).toBe(text);
  expect(region.style.whiteSpace).toBe("pre-wrap");
  expect(region.style.overflowWrap).toBe("anywhere");
  expect(["scroll", "auto", "hidden", "clip"]).not.toContain(
    region.style.overflowX,
  );
  expect(["scroll", "auto", "hidden", "clip"]).not.toContain(
    region.style.overflow,
  );
  const lines = lineElements(region);
  expect(lines.length).toBe(1);
  const line = lines[0];
  expect(line.style.display).toBe("block");
  expect(line.style.paddingLeft.replace(/\s+/g, "")).toBe("8ch");
  expect(line.style.textIndent.replace(/\s+/g, "")).toBe("-8ch");
});
