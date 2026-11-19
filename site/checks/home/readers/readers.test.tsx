// ail-derived-from: Readers@e6066e607b467f9f
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Readers } from "../../../src/gen/home/readers/readers";

afterEach(() => {
  cleanup();
});

test("the first reader", () => {
  render(<Readers />);
  const stakeholder = screen.getByRole("tab", { name: "Stakeholder" });
  expect(stakeholder.getAttribute("aria-selected")).toBe("true");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("ail show stakeholder");
});

test("picking another reader", () => {
  render(<Readers />);
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  act(() => {
    fireEvent.click(specialist);
  });
  expect(screen.getByRole("tab", { name: "Specialist" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tab", { name: "Stakeholder" }).getAttribute("aria-selected")).not.toBe("true");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("ail show specialist ai");
});

test("arrow keys", () => {
  render(<Readers />);
  const stakeholder = screen.getByRole("tab", { name: "Stakeholder" });
  act(() => {
    stakeholder.focus();
  });
  expect(document.activeElement).toBe(stakeholder);
  act(() => {
    fireEvent.keyDown(stakeholder, { key: "ArrowLeft" });
  });
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  expect(specialist.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(specialist);
});
