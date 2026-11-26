// ail-derived-from: SpecTree@9d84f1b4e3ae33e2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { SpecTree } from "../../../src/gen/home/sections/spec-tree";

afterEach(() => {
  cleanup();
});

test("screenshots beside their spec", () => {
  const files = ["app/app.ail.md", "app/play/play.ail.md", "board/board.ail.md"];
  const shots = ["app/shots/app/01-a.png", "board/shots/board-view/01-b.png"];
  const picked = "board/board.ail.md";
  render(<SpecTree files={files} shots={shots} picked={picked} onPick={() => {}} />);

  const nav = screen.getByRole("navigation", { name: "Spec files" });

  const expectedRows = [
    "app/",
    "app.ail.md",
    "app/shots/app/",
    "01-a.png",
    "app/play/",
    "play.ail.md",
    "board/",
    "board.ail.md",
    "board/shots/board-view/",
    "01-b.png",
  ];
  const text = (nav.textContent ?? "").split("▣ ").join("");
  expect(text).toBe(expectedRows.join(""));

  const expectedPaths = [
    "app/app.ail.md",
    "app/shots/app/01-a.png",
    "app/play/play.ail.md",
    "board/board.ail.md",
    "board/shots/board-view/01-b.png",
  ];
  const buttons = within(nav).getAllByRole("button");
  expect(buttons.length).toBe(expectedPaths.length);
  expectedPaths.forEach((path, i) => {
    expect(within(nav).getByRole("button", { name: path })).toBe(buttons[i]);
  });

  const pickedButton = within(nav).getByRole("button", { name: "board/board.ail.md" });
  expect(pickedButton.getAttribute("aria-pressed")).toBe("true");
  for (const button of buttons) {
    if (button !== pickedButton) {
      expect(button.getAttribute("aria-pressed")).not.toBe("true");
    }
  }

  const picker = screen.getByRole("combobox", { name: "Spec files" }) as HTMLSelectElement;
  expect(picker.value).toBe("board/board.ail.md");
});
