// ail-derived-from: ChooseOpponent@9780e0dc140a033b
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChooseOpponent } from "../../../src/gen/app/play/choose-opponent";

afterEach(() => {
  cleanup();
});

test("switching to the computer", () => {
  const onChange = mock((_opponent: "friend" | "computer") => {});
  render(<ChooseOpponent opponent="friend" onChange={onChange} />);

  const group = screen.getByRole("radiogroup", { name: "Opponent" });
  expect(group).toBeTruthy();

  fireEvent.click(screen.getByRole("radio", { name: "Computer" }));

  expect(onChange).toHaveBeenCalledWith("computer");
});
