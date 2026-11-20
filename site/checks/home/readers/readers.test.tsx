// ail-derived-from: Readers@2c6ed8149f4603bd
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Readers } from "../../../src/gen/home/readers/readers";

afterEach(() => {
  cleanup();
});

function tabNamed(name: string): HTMLElement {
  const tablist = screen.getByRole("tablist", { name: "Readers" });
  return within(tablist).getByRole("tab", { name });
}

test("the first reader", () => {
  render(<Readers />);
  expect(tabNamed("Stakeholder").getAttribute("aria-selected")).toBe("true");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("PRODUCT LEVEL");
});

test("picking another reader", () => {
  render(<Readers />);
  act(() => {
    fireEvent.click(tabNamed("Specialist"));
  });
  expect(tabNamed("Specialist").getAttribute("aria-selected")).toBe("true");
  expect(tabNamed("Stakeholder").getAttribute("aria-selected")).toBe("false");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("SPECIALIST LEVEL");
});

test("arrow keys", () => {
  render(<Readers />);
  const stakeholder = tabNamed("Stakeholder");
  act(() => {
    stakeholder.focus();
  });
  expect(document.activeElement).toBe(stakeholder);
  act(() => {
    fireEvent.keyDown(stakeholder, { key: "ArrowLeft" });
  });
  const specialist = tabNamed("Specialist");
  expect(specialist.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(specialist);
});
