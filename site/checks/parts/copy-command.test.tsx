// ail-derived-from: CopyCommand@1aa626b90d340d1c
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CopyCommand } from "../../src/gen/parts/copy-command";

let clipboardText: string | undefined;
let originalClipboard: PropertyDescriptor | undefined;

beforeEach(() => {
  clipboardText = undefined;
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
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

test("copying", async () => {
  render(<CopyCommand command="ail check" />);

  const button = screen.getByRole("button", { name: "Copy ail check" });

  await act(async () => {
    fireEvent.click(button);
  });

  expect(clipboardText).toBe("ail check");

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Copy ail check" }).textContent).toBe("Copied");
  });

  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1600));
  });

  expect(screen.getByRole("button", { name: "Copy ail check" }).textContent).toBe("Copy");
}, 10000);
