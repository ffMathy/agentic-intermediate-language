// ail-derived-from: Segmented@17d27a71b4cd8c1a
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Segmented } from "../../../src/gen/ui/segmented/segmented";

afterEach(() => {
  cleanup();
});

test("picking another option", () => {
  const onChange = mock((_value: string) => {});
  render(
    <Segmented
      label="Opponent"
      options={[
        { value: "friend", label: "Friend" },
        { value: "computer", label: "Computer" },
      ]}
      value="friend"
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "Computer" }));

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("computer");
  expect(
    screen.getByRole("radio", { name: "Friend" }).getAttribute("aria-checked"),
  ).toBe("true");
});
