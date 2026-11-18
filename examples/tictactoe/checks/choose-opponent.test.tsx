// ail-derived-from: ChooseOpponent@25d2b7f3c1cb78e5
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChooseOpponent } from "../src/gen/choose-opponent";

afterEach(cleanup);

test("switching to the computer", () => {
  const onChange = mock((_opponent: string) => {});
  render(<ChooseOpponent opponent="friend" onChange={onChange} />);
  expect(screen.getByRole("radiogroup", { name: "Opponent" })).toBeTruthy();
  expect(screen.getByRole("radio", { name: "Friend" }).getAttribute("aria-checked")).toBe("true");
  fireEvent.click(screen.getByRole("radio", { name: "Computer" }));
  expect(onChange).toHaveBeenCalledWith("computer");
});
