// ail-derived-from: CodeBlock@58a09af045752d21
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  const lineEls = Array.from(region.children) as HTMLElement[];
  expect(lineEls.length).toBe(2);
  expect(lineEls[0].textContent).toBe("a  b");
  expect(lineEls[1].textContent).toBe("  c");
  for (const el of lineEls) {
    expect(el.tagName.toLowerCase()).toBe("span");
    expect(el.style.display).toBe("block");
  }
  expect(region.textContent).toBe("a  b  c");
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
  const marks = region.querySelectorAll("mark");
  expect(marks.length).toBe(1);
  expect(marks[0].textContent).toBe("never loses");
  expect(document.querySelectorAll("mark").length).toBe(1);
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

test("a long line wraps under itself", () => {
  const line =
    "    because an instant answer feels like the player's own move did nothing";
  render(<CodeBlock lines={[line]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  expect(region.textContent).toBe(line);
  expect(region.style.whiteSpace).toBe("pre-wrap");
  expect(region.style.getPropertyValue("overflow-wrap")).toBe("anywhere");
  expect(["scroll", "auto", "hidden"]).not.toContain(region.style.overflowX);
  expect(["scroll", "auto", "hidden"]).not.toContain(region.style.overflow);
  const lineEl = region.children[0] as HTMLElement;
  expect(lineEl.textContent).toBe(line);
  expect(lineEl.style.paddingLeft).toBe("8ch");
  expect(lineEl.style.textIndent).toBe("-8ch");
});
