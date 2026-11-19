// ail-derived-from: Segmented@d30ed6a78c95998b
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Segmented } from "../../src/gen/ui/segmented";

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

  const group = screen.getByRole("radiogroup", { name: "Opponent" });
  expect(group).toBeTruthy();

  const friend = screen.getByRole("radio", { name: "Friend" });
  const computer = screen.getByRole("radio", { name: "Computer" });
  expect(friend.getAttribute("aria-checked")).toBe("true");
  expect(computer.getAttribute("aria-checked")).toBe("false");

  fireEvent.click(computer);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("computer");

  expect(screen.getByRole("radio", { name: "Friend" }).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("radio", { name: "Computer" }).getAttribute("aria-checked")).toBe("false");
});
