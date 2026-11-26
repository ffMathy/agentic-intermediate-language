// ail-derived-from: ChooseOpponent@eaee87975c2041a0
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { ChooseOpponent } from "../../../../src/gen/app/play/choose-opponent/choose-opponent";
import type { Opponent } from "../../../../src/gen/engine/game-state/game-state";

afterEach(() => {
  cleanup();
});

test("switching to the computer", () => {
  const onChange = mock((_opponent: Opponent) => {});
  render(<ChooseOpponent opponent="friend" onChange={onChange} />);

  const group = screen.getByRole("radiogroup", { name: "Opponent" });
  fireEvent.click(within(group).getByRole("radio", { name: "Computer" }));

  expect(onChange).toHaveBeenCalledWith("computer");
});
