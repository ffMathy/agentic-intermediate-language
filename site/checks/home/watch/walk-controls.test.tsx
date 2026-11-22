// ail-derived-from: WalkControls@d16ff681459173f9
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WalkControls } from "../../../src/gen/home/watch/walk-controls";

afterEach(() => {
  cleanup();
});

test("on the first chapter", () => {
  render(
    <WalkControls
      mode="play"
      first={true}
      last={false}
      onPrevious={() => {}}
      onPlay={() => {}}
      onNext={() => {}}
    />,
  );
  const buttons = screen.getAllByRole("button");
  const names = buttons.map((b) => (b.textContent ?? "").trim());
  expect(names).toEqual(["Previous chapter", "Play", "Next chapter"]);
  const previous = screen.getByRole("button", { name: "Previous chapter" }) as HTMLButtonElement;
  const next = screen.getByRole("button", { name: "Next chapter" }) as HTMLButtonElement;
  expect(previous.disabled).toBe(true);
  expect(next.disabled).toBe(false);
});

test("moving on", () => {
  const onNext = mock(() => {});
  render(
    <WalkControls
      mode="pause"
      first={false}
      last={false}
      onPrevious={() => {}}
      onPlay={() => {}}
      onNext={onNext}
    />,
  );
  expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next chapter" }));
  expect(onNext).toHaveBeenCalledTimes(1);
});
