// ail-derived-from: ProofScreens@5d652726f2e3a16c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ProofScreens } from "../../../../../../src/gen/home/journey/stops/stop-proof/proof-screens/proof-screens";

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

  const path = "examples/tictactoe/ail/app/play/shots/";
  const lines = Array.from(container.querySelectorAll("p")).filter((p) =>
    (p.textContent ?? "").includes(path),
  );
  expect(lines.length).toBeGreaterThan(0);
});
