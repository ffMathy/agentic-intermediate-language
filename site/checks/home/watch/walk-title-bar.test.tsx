// ail-derived-from: WalkTitleBar@84a71888969f957d
import { afterEach, expect, mock, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { WalkTitleBar } from "../../../src/gen/home/watch/walk-title-bar";

afterEach(() => {
  cleanup();
});

test("the tabs", () => {
  render(<WalkTitleBar tab="build" now="0:06" total="1:25" onPick={() => {}} />);
  const tablist = screen.getByRole("tablist", { name: "Walkthroughs" });
  const tabs = within(tablist).getAllByRole("tab");
  expect(tabs.length).toBe(2);
  const build = within(tablist).getByRole("tab", { name: "ail build" });
  const adopt = within(tablist).getByRole("tab", { name: "ail adopt" });
  expect(tabs[0]).toBe(build);
  expect(tabs[1]).toBe(adopt);
  expect(build.getAttribute("aria-selected")).toBe("true");
  expect(adopt.getAttribute("aria-selected")).toBe("false");
  expect(document.body.textContent ?? "").toContain("0:06 / 1:25");
});

test("arrow keys", () => {
  const onPick = mock((_tab: "build" | "adopt") => {});
  render(<WalkTitleBar tab="build" now="0:06" total="1:25" onPick={onPick} />);
  const build = screen.getByRole("tab", { name: "ail build" });
  const adopt = screen.getByRole("tab", { name: "ail adopt" });
  act(() => {
    build.focus();
  });
  expect(document.activeElement).toBe(build);
  fireEvent.keyDown(build, { key: "ArrowRight" });
  expect(onPick).toHaveBeenCalledTimes(1);
  expect(onPick.mock.calls[0]?.[0]).toBe("adopt");
  expect(document.activeElement).toBe(adopt);
});
