// ail-derived-from: CodeBlock@2fc882c12eb5f63c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

function lineSpans(region: HTMLElement): HTMLElement[] {
  return Array.from(region.children).filter(
    (el): el is HTMLElement => el.tagName.toLowerCase() === "span",
  );
}

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  const spans = lineSpans(region);
  expect(spans.length).toBe(2);
  expect(spans[0].textContent).toBe("a  b");
  expect(spans[1].textContent).toBe("  c");
  for (const span of spans) {
    expect(span.style.display).toBe("block");
  }
  expect(region.textContent).toBe("a  b  c");
  expect(region.style.whiteSpace).toBe("pre-wrap");
});

test("the thread is marked", () => {
  render(
    <CodeBlock
      lines={["4. The computer never loses.", "5. New game"]}
      label="Thread"
      highlight={["never loses"]}
    />,
  );
  const region = screen.getByRole("region", { name: "Thread" });
  const marks = Array.from(document.querySelectorAll("mark"));
  expect(marks.length).toBe(1);
  expect(marks[0].textContent).toBe("never loses");
  expect(region.contains(marks[0])).toBe(true);
});

test("a caption", () => {
  render(
    <CodeBlock
      lines={["node Game : flow"]}
      label="Spec"
      caption="examples/tictactoe/tictactoe.ail.md"
    />,
  );
  const region = screen.getByRole("region", { name: "Spec" });
  const caption = screen.getByText("examples/tictactoe/tictactoe.ail.md");
  expect(region.contains(caption)).toBe(false);
  expect(
    region.compareDocumentPosition(caption) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("a long line wraps under itself", () => {
  const line =
    "    because an instant answer feels like the player's own move did nothing";
  render(
    <div style={{ width: "30ch" }}>
      <CodeBlock lines={[line]} label="Long" />
    </div>,
  );
  const region = screen.getByRole("region", { name: "Long" });
  expect(region.style.whiteSpace).toBe("pre-wrap");
  expect(region.style.overflowWrap).toBe("anywhere");
  for (const value of [region.style.overflow, region.style.overflowX]) {
    expect(["scroll", "auto", "hidden", "clip"]).not.toContain(value);
  }
  expect(region.textContent).toBe(line);
  const spans = lineSpans(region);
  expect(spans.length).toBe(1);
  expect(spans[0].textContent).toBe(line);
  expect(spans[0].style.display).toBe("block");
  expect(spans[0].style.paddingLeft).toBe("8ch");
  expect(spans[0].style.textIndent).toBe("-8ch");
});
