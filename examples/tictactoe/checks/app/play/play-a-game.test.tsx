// ail-derived-from: PlayAGame@5445e0669a18e44c
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PlayAGame } from "../../../src/gen/app/play/play-a-game";

afterEach(() => {
  cleanup();
});

function squares(): HTMLButtonElement[] {
  const grid = screen.getByRole("grid");
  const buttons = within(grid).getAllByRole("button") as HTMLButtonElement[];
  expect(buttons.length).toBe(9);
  return buttons;
}

function statusText(): string {
  const el = document.querySelector("[aria-live]");
  expect(el).not.toBeNull();
  return (el?.textContent ?? "").trim();
}

function pick(index: number): void {
  fireEvent.click(squares()[index]);
}

function hasMark(el: HTMLElement, mark: "X" | "O"): boolean {
  return new RegExp(`\\b${mark}\\b`).test(el.textContent ?? "");
}

function chooseComputer(): void {
  const roles = ["radio", "button", "tab", "menuitemradio", "switch", "option"] as const;
  for (const role of roles) {
    const el = screen.queryByRole(role, { name: "Computer" });
    if (el) {
      if (role === "option") {
        const select = el.closest("select");
        expect(select).not.toBeNull();
        fireEvent.change(select as HTMLSelectElement, {
          target: { value: (el as HTMLOptionElement).value },
        });
      } else {
        fireEvent.click(el);
      }
      return;
    }
  }
  throw new Error('No control named "Computer" found');
}

test("X always starts", () => {
  render(<PlayAGame />);
  expect(statusText()).toBe("X's turn");
});

test("taking turns", () => {
  render(<PlayAGame />);
  const emptyText = squares()[4].textContent;
  pick(4);
  const center = squares()[4];
  expect(center.textContent).not.toBe(emptyText);
  expect(hasMark(center, "X")).toBe(true);
  expect(hasMark(center, "O")).toBe(false);
  expect(statusText()).toBe("O's turn");
});

test("a taken square can't be picked", () => {
  render(<PlayAGame />);
  const emptyText = squares()[0].textContent;
  pick(4);
  const before = squares().map((s) => s.textContent);
  pick(4);
  const after = squares().map((s) => s.textContent);
  expect(after).toEqual(before);
  expect(hasMark(squares()[4], "X")).toBe(true);
  expect(hasMark(squares()[4], "O")).toBe(false);
  squares().forEach((s, i) => {
    if (i !== 4) expect(s.textContent).toBe(emptyText);
  });
  expect(statusText()).toBe("O's turn");
});

test("winning", () => {
  render(<PlayAGame />);
  pick(0);
  pick(4);
  pick(1);
  pick(6);
  expect(statusText()).toBe("X's turn");
  pick(2);
  expect(statusText()).toBe("X wins!");
  const all = squares();
  all.forEach((s, i) => {
    const style = s.getAttribute("style") ?? "";
    if (i <= 2) {
      expect(style).toContain("var(--color-highlight)");
    } else {
      expect(style).not.toContain("var(--color-highlight)");
    }
  });
  all.forEach((s) => {
    expect(s.disabled).toBe(true);
  });
});

test("draw", () => {
  render(<PlayAGame />);
  for (const i of [0, 1, 2, 4, 3, 5, 7, 6]) pick(i);
  pick(8);
  expect(statusText()).toBe("It's a draw");
});

test("new game", () => {
  render(<PlayAGame />);
  const emptyText = squares()[0].textContent;
  for (const i of [0, 3, 1, 4, 2]) pick(i);
  expect(statusText()).toBe("X wins!");
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  squares().forEach((s) => {
    expect(s.textContent).toBe(emptyText);
  });
  expect(statusText()).toBe("X's turn");
});

test("the computer answers", async () => {
  render(<PlayAGame />);
  chooseComputer();
  pick(4);
  await waitFor(
    () => {
      const os = squares().filter((s) => hasMark(s, "O") && !hasMark(s, "X"));
      expect(os.length).toBe(1);
    },
    { timeout: 2000 },
  );
  const xs = squares().filter((s) => hasMark(s, "X") && !hasMark(s, "O"));
  expect(xs.length).toBe(1);
  expect(hasMark(squares()[4], "X")).toBe(true);
  expect(statusText()).toBe("X's turn");
});
