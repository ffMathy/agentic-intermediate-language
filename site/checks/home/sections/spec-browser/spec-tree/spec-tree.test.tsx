// ail-derived-from: SpecTree@e46ed24454ea915e
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecTree } from "../../../../../src/gen/home/sections/spec-browser/spec-tree/spec-tree";

afterEach(() => {
  cleanup();
});

function visibleText(node: Node): string {
  if (node.nodeType === 3) {
    return node.textContent ?? "";
  }
  if (node.nodeType !== 1) {
    return "";
  }
  const element = node as Element;
  if (element.getAttribute("aria-hidden") === "true") {
    return "";
  }
  let text = "";
  element.childNodes.forEach((child) => {
    text += visibleText(child);
  });
  return text;
}

type Row = { kind: "folder" | "file"; text: string };

function readRows(root: Element): Row[] {
  const rows: Row[] = [];
  const walk = (element: Element): void => {
    for (const child of Array.from(element.children)) {
      const tag = child.tagName.toLowerCase();
      if (tag === "button") {
        rows.push({ kind: "file", text: visibleText(child).trim() });
        continue;
      }
      if (
        tag === "div" &&
        child.querySelector("button, div") === null &&
        visibleText(child).trim() !== ""
      ) {
        rows.push({ kind: "folder", text: visibleText(child).trim() });
        continue;
      }
      walk(child);
    }
  };
  walk(root);
  return rows;
}

test("screenshots beside their spec", () => {
  const files = [
    "app/app.ail.md",
    "app/play/play.ail.md",
    "board/board.ail.md",
    "board/board-view/board-view.ail.md",
  ];
  const shots = ["app/shots/01-a.png", "board/board-view/shots/01-b.png"];
  render(
    <SpecTree
      files={files}
      shots={shots}
      picked="board/board.ail.md"
      onPick={() => {}}
    />,
  );

  const nav = screen.getByRole("navigation", { name: "Spec files" });
  expect(readRows(nav)).toEqual([
    { kind: "folder", text: "app/" },
    { kind: "file", text: "app.ail.md" },
    { kind: "folder", text: "app/shots/" },
    { kind: "file", text: "01-a.png" },
    { kind: "folder", text: "app/play/" },
    { kind: "file", text: "play.ail.md" },
    { kind: "folder", text: "board/" },
    { kind: "file", text: "board.ail.md" },
    { kind: "folder", text: "board/board-view/" },
    { kind: "file", text: "board-view.ail.md" },
    { kind: "folder", text: "board/board-view/shots/" },
    { kind: "file", text: "01-b.png" },
  ]);

  const picked = screen.getByRole("button", { name: "board/board.ail.md" });
  expect(picked.getAttribute("aria-pressed")).toBe("true");
  for (const path of [...files, ...shots]) {
    if (path === "board/board.ail.md") {
      continue;
    }
    const other = screen.getByRole("button", { name: path });
    expect(other.getAttribute("aria-pressed")).not.toBe("true");
  }

  const picker = screen.getByRole("combobox", { name: "Spec files" }) as HTMLSelectElement;
  expect(picker.value).toBe("board/board.ail.md");
});
