// ail-derived-from: ProofScreens@150655e3ad6e0f4d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ProofScreens } from "../../../../src/gen/home/journey/stops/proof-screens";

afterEach(() => {
  cleanup();
});

test("the screens", () => {
  const { container } = render(<ProofScreens />);

  const winning = screen.getByRole("img", {
    name: "Screenshot at the end of the check “winning”",
  });
  const answers = screen.getByRole("img", {
    name: "Screenshot at the end of the check “the computer answers”",
  });

  expect(
    winning.compareDocumentPosition(answers) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();

  const shotNames = screen
    .getAllByRole("img")
    .map((el) => el.getAttribute("alt") ?? "")
    .filter((alt) => alt.startsWith("Screenshot at the end of the check"));
  expect(shotNames).toEqual([
    "Screenshot at the end of the check “winning”",
    "Screenshot at the end of the check “the computer answers”",
  ]);

  expect(container.textContent ?? "").toContain("examples/tictactoe/checks/shots/");
});
