// ail-derived-from: CodeBlock@725d578b2600a86c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

function textWithBreaks(el: HTMLElement): string {
  const copy = el.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("br").forEach((br) => {
    br.replaceWith(document.createTextNode("\n"));
  });
  return copy.textContent ?? "";
}

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  expect(textWithBreaks(region)).toBe("a  b\n  c");
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
  expect(marks[0]?.textContent).toBe("never loses");
});

test("a caption", () => {
  render(
    <CodeBlock
      lines={["node Game : flow"]}
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
