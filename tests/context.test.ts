import { expect, test } from "bun:test";
import { buildContext } from "../src/context.ts";
import { loadProject } from "../src/project.ts";
import { KATA } from "./helpers.ts";

const p = loadProject(KATA);
const ctx = (name: string) => buildContext(p, p.nodes.get(name)!);

test("context contains the node, its why chain and its dependencies' contracts", () => {
  const c = ctx("GameReducer");
  expect(c).toContain("node GameReducer : fn");
  expect(c).toContain("- TicTacToe: A quick, familiar game");
  expect(c).toContain("### Rules — built at src/gen/engine/rules/rules.ts, so import from \"../rules/rules\"");
  expect(c).toContain("evaluate(board: Board) -> Status");
});

test("encapsulation: a dependency's how never leaks into a dependant's context", () => {
  const c = ctx("PlayAGame");
  expect(c).toContain("choose(board: Board, me: Mark = \"O\") -> number");
  expect(c).not.toContain("full minimax");
  expect(c).not.toContain("alpha-beta");
});

test("unrelated nodes are not in the context", () => {
  const c = ctx("Rules");
  expect(c).not.toContain("node ComputerPlayer");
  expect(c).not.toContain("node BoardView");
});

test("the target and the tokens come from the project's own spec", () => {
  const c = ctx("Rules");
  expect(c).toContain("## Target (the project's conventions — normative)");
  expect(c).toContain("color.player.x=#2563eb");
  expect(c).not.toContain("golden");
});

test("context is deterministic", () => {
  expect(ctx("BoardView")).toBe(buildContext(loadProject(KATA), loadProject(KATA).nodes.get("BoardView")!));
});
