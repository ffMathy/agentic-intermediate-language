// ail-derived-from: SpecEditor@74cf657a51d43dbd
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

mock.module("@monaco-editor/react", () => {
  const Editor = (props: { loading?: ReactNode }) => <>{props.loading}</>;
  return {
    default: Editor,
    Editor,
    loader: {
      config: () => {},
      init: () => new Promise(() => {}),
    },
  };
});

const { SpecEditor } = await import("../../src/gen/parts/spec-editor");

afterEach(() => {
  cleanup();
});

test("readable before the editor loads", () => {
  render(
    <SpecEditor
      text="node A : fn   level: system"
      path="a.ail.md"
      label="Source of a.ail.md"
    />,
  );
  const region = screen.getByRole("region", { name: "Source of a.ail.md" });
  expect(region.textContent ?? "").toContain("node A : fn   level: system");
});
