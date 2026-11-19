import { expect, test } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lint } from "../src/lint.ts";
import { loadProject } from "../src/project.ts";
import { KATA, load, tempProject } from "./helpers.ts";

const codes = (dir: string) => lint(load(dir)).filter((d) => d.severity === "error").map((d) => d.code);

function edit(dir: string, from: string, to: string) {
  const f = join(dir, "mini.ail.md");
  const s = readFileSync(f, "utf8");
  if (!s.includes(from)) throw new Error(`fixture lacks: ${from}`);
  writeFileSync(f, s.replace(from, to));
}

test("the kata and the fixture lint clean", () => {
  expect(lint(loadProject(KATA)).filter((d) => d.severity === "error")).toEqual([]);
  expect(codes(tempProject())).toEqual([]);
});

test("product claims need a refinement", () => {
  const dir = tempProject();
  edit(dir, "2. You can find the biggest value.  refined-by: Pick", "2. You can find the biggest value.");
  expect(codes(dir)).toContain("missing-refinement");
});

test("refinements must point at descendants", () => {
  const dir = tempProject();
  edit(dir, "refined-by: Pick", "refined-by: Nowhere");
  expect(codes(dir)).toContain("bad-refinement");
});

test("why must trace to an ancestor", () => {
  const dir = tempProject();
  edit(dir, "Choose the biggest item.   <- Calc", "Choose the biggest item.   <- Add");
  expect(codes(dir)).toContain("bad-why-ref");
});

test("code notation is rejected at plain-language levels", () => {
  const dir = tempProject();
  edit(dir, "1. You can add two numbers.", "1. You can call addNumbers(a, b).");
  expect(codes(dir)).toContain("code-in-plain-level");
});

test("product nodes may not carry how/look/binds", () => {
  const dir = tempProject();
  edit(dir, "  children  Add, Pick", "  how\n    decide something\n      because reasons\n  children  Add, Pick");
  expect(codes(dir)).toContain("plain-level-detail");
});

test("levels may only deepen", () => {
  const dir = tempProject();
  edit(dir, "node Add : fn   level: system", "node Add : fn   level: product");
  edit(dir, "  children  Add, Pick", "  children  Pick");
  edit(dir, "  children  Pick", "  children  Pick\n```\n\n```ail\nnode Holder : fn   level: system\n  why  holds.  <- Calc\n  children  Add");
  edit(dir, "  children  Pick\n", "  children  Pick, Holder\n");
  expect(codes(dir)).toContain("level-order");
});

test("unknown tokens and components are caught, and components must be used", () => {
  const dir = tempProject();
  edit(dir, "  uses  Add", "  look\n    gap space.99, Button.huge, then Add.small\n  uses  Pick2");
  writeFileSync(join(dir, "extra.ail.md"), "```ail\ncatalog\n  tokens\n    space.1=4px\n```\n");
  const c = codes(dir);
  expect(c).toContain("unknown-token");
  expect(c).toContain("unknown-component");
  expect(c).toContain("missing-uses");
});

test("dependency cycles are caught", () => {
  const dir = tempProject();
  edit(dir, "      rejected a lookup table because it is silly", "      rejected a lookup table because it is silly\n  uses  Pick");
  expect(codes(dir)).toContain("cycle");
});

test("examples need an expected value", () => {
  const dir = tempProject();
  edit(dir, "add(1, 2) => 3", "add(1, 2)");
  expect(codes(dir)).toContain("example-syntax");
});
