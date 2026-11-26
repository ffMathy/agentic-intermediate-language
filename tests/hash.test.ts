import { expect, test } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { canonicalNode, compileHash } from "../src/hash.ts";
import { parseFile } from "../src/parse.ts";
import { load, tempProject } from "./helpers.ts";

const node = (src: string) => parseFile("x", "```ail\n" + src + "\n```").nodes[0]!;

test("cosmetic edits do not change the canonical form", () => {
  const a = node('node A : fn   level: system\n  why   x  y\n  what\n    f(1) => 2   ; a comment\n  how\n    decide z');
  const b = node('node A : fn level: system\n\n  how\n      decide z\n  what\n      f(1) => 2\n  why x y   ; other comment');
  expect(canonicalNode(a)).toBe(canonicalNode(b));
});

test("whitespace inside string literals is significant", () => {
  expect(canonicalNode(node('node A : fn\n  copy  k "a  b"'))).not.toBe(canonicalNode(node('node A : fn\n  copy  k "a b"')));
});

test("a dependency's how is encapsulated; its what is not", () => {
  const dir = tempProject();
  const before = compileHash(load(dir), load(dir).nodes.get("Pick")!);

  const add = join(dir, "add.ail.md");
  writeFileSync(add, readFileSync(add, "utf8").replace("rejected a lookup table because it is silly", "rejected a table because it is slow"));
  expect(compileHash(load(dir), load(dir).nodes.get("Pick")!)).toBe(before);

  writeFileSync(add, readFileSync(add, "utf8").replace("add(-1, 1) => 0", "add(-1, 1) => 0\n      add(2, 2) => 4"));
  expect(compileHash(load(dir), load(dir).nodes.get("Pick")!)).not.toBe(before);
});
