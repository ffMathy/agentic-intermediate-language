// ail-derived-from: CopyCommand@64d1c851979c4a27
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CopyCommand } from "../../src/gen/parts/copy-command";

let clipboardText: string | null = null;
let originalClipboard: PropertyDescriptor | undefined;

beforeEach(() => {
  clipboardText = null;
  originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: (text: string): Promise<void> => {
        clipboardText = text;
        return Promise.resolve();
      },
    },
  });
});

afterEach(() => {
  cleanup();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    delete (navigator as unknown as Record<string, unknown>).clipboard;
  }
});

test("copying", async () => {
  render(<CopyCommand command="ail check" />);

  const button = screen.getByRole("button", { name: "Copy ail check" });

  await act(async () => {
    fireEvent.click(button);
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(clipboardText).toBe("ail check");
  expect(screen.getByRole("button", { name: "Copy ail check" }).textContent).toBe("Copied");

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1600));
  });

  expect(screen.getByRole("button", { name: "Copy ail check" }).textContent).toBe("Copy");
}, 5000);
