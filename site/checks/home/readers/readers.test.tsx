// ail-derived-from: Readers@fdaf64ad82ccb44f
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
  act(() => {
    fireEvent.click(screen.getByRole("tab", { name: "Specialist" }));
  });
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  const stakeholder = screen.getByRole("tab", { name: "Stakeholder" });
  expect(specialist.getAttribute("aria-selected")).toBe("true");
  expect(stakeholder.getAttribute("aria-selected")).not.toBe("true");
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
    fireEvent.keyDown(stakeholder, { key: "ArrowLeft", code: "ArrowLeft" });
  });
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  expect(specialist.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(specialist);
});
