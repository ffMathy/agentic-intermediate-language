// ail-derived-from: WalkTimeline@1b59955511aa6639
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
  const one = within(list).getByRole("button", { name: "Chapter 1: One" });
  const two = within(list).getByRole("button", { name: "Chapter 2: Two" });
  const three = within(list).getByRole("button", { name: "Chapter 3: Three" });
  expect(two.getAttribute("aria-current")).toBe("step");
  expect(one.getAttribute("aria-current")).not.toBe("step");
  expect(three.getAttribute("aria-current")).not.toBe("step");
  const current = list.querySelectorAll('[aria-current="step"]');
  expect(current.length).toBe(1);
  expect(current[0]).toBe(two);
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
