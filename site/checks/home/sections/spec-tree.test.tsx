// ail-derived-from: SpecTree@1da232664b5bb3e8
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecTree } from "../../../src/gen/home/sections/spec-tree";

afterEach(() => {
  cleanup();
});

function visibleText(element: Element): string {
  const copy = element.cloneNode(true) as Element;
  copy.querySelectorAll("[aria-hidden='true']").forEach((hidden) => {
    hidden.remove();
  });
  return (copy.textContent ?? "").trim();
}

function readList(nav: HTMLElement): string[] {
  const rows: string[] = [];
  nav.querySelectorAll("*").forEach((element) => {
    if (element.tagName === "BUTTON") {
      rows.push(visibleText(element));
      return;
    }
    if (element.closest("button") !== null) {
      return;
    }
    if (element.children.length > 0) {
      return;
    }
    const text = (element.textContent ?? "").trim();
    if (text !== "") {
      rows.push(text);
    }
  });
  return rows;
}

test("screenshots beside their spec", () => {
  const files = ["app/app.ail.md", "app/play/play.ail.md", "board/board.ail.md"];
  const shots = ["app/shots/01-a.png", "board/shots/board-view/01-b.png"];
  render(
    <SpecTree
      files={files}
      shots={shots}
      picked="board/board.ail.md"
      onPick={() => {}}
    />,
  );

  const nav = screen.getByRole("navigation", { name: "Spec files" });
  expect(readList(nav)).toEqual([
    "app/",
    "app.ail.md",
    "app/shots/",
    "01-a.png",
    "app/play/",
    "play.ail.md",
    "board/",
    "board.ail.md",
    "board/shots/board-view/",
    "01-b.png",
  ]);

  const picked = screen.getByRole("button", { name: "board/board.ail.md" });
  expect(picked.getAttribute("aria-pressed")).toBe("true");
  for (const path of [
    "app/app.ail.md",
    "app/shots/01-a.png",
    "app/play/play.ail.md",
    "board/shots/board-view/01-b.png",
  ]) {
    const other = screen.getByRole("button", { name: path });
    expect(other.getAttribute("aria-pressed")).not.toBe("true");
  }

  const picker = screen.getByRole("combobox", { name: "Spec files" }) as HTMLSelectElement;
  expect(picker.value).toBe("board/board.ail.md");
});
