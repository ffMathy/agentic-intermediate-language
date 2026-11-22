// ail-derived-from: WalkTimeline@d5e414c319dd1285
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { WalkTimeline } from "../../../src/gen/home/watch/walk-timeline";
import type { Beat } from "../../../src/gen/home/watch/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

function beat(id: string, title: string, seconds: number): Beat {
  return {
    id,
    title,
    caption: "",
    seconds,
    branch: false,
    lines: [],
    states: {},
    inset: { kind: "none" },
  };
}

test("the chapters", () => {
  const beats: Beat[] = [
    beat("one", "One", 6),
    beat("two", "Two", 9),
    beat("three", "Three", 9),
  ];
  render(<WalkTimeline beats={beats} chapter={1} played={0.5} onPick={() => {}} />);
  const list = screen.getByRole("list", { name: "Chapters" });
  const buttons = within(list).getAllByRole("button");
  expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
    "Chapter 1: One",
    "Chapter 2: Two",
    "Chapter 3: Three",
  ]);
  expect(within(list).getByRole("button", { name: "Chapter 1: One" })).toBe(buttons[0]);
  expect(within(list).getByRole("button", { name: "Chapter 2: Two" })).toBe(buttons[1]);
  expect(within(list).getByRole("button", { name: "Chapter 3: Three" })).toBe(buttons[2]);
  expect(buttons[0].getAttribute("aria-current")).toBeNull();
  expect(buttons[1].getAttribute("aria-current")).toBe("step");
  expect(buttons[2].getAttribute("aria-current")).toBeNull();
});

test("picking a chapter", () => {
  const beats: Beat[] = [
    beat("one", "One", 6),
    beat("two", "Two", 9),
    beat("three", "Three", 9),
  ];
  const onPick = mock((_chapter: number) => {});
  render(<WalkTimeline beats={beats} chapter={0} played={0} onPick={onPick} />);
  fireEvent.click(screen.getByRole("button", { name: "Chapter 3: Three" }));
  expect(onPick).toHaveBeenCalledTimes(1);
  expect(onPick).toHaveBeenCalledWith(2);
});
