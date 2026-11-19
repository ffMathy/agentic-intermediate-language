// ail-derived-from: CopyCommand@e6a08e317cc6ab20
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  render(<CopyCommand command="ail build" />);
  const button = screen.getByRole("button", { name: "Copy ail build" });

  await act(async () => {
    fireEvent.click(button);
  });

  expect(clipboardText).toBe("ail build");
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Copy ail build" }).textContent).toBe("Copied");
  });

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1600));
  });

  expect(screen.getByRole("button", { name: "Copy ail build" }).textContent).toBe("Copy");
});
