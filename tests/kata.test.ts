import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { plan } from "../src/plan.ts";
import { loadProject } from "../src/project.ts";
import { verifyProject } from "../src/verify.ts";
import { KATA } from "./helpers.ts";

const installed = existsSync(join(KATA, "node_modules", "react"));

test("the kata's generated code is fresh, matches the lock, and passes every IL check", () => {
  const p = loadProject(KATA);
  expect(plan(p).filter((e) => e.status !== "fresh")).toEqual([]);
  if (!installed) return console.warn("skipping kata verification: run `bun install` in examples/tictactoe");
  const r = verifyProject(p);
  const failed = r.results.flatMap((x) => x.checks.filter((c) => !c.ok).map((c) => `${x.node} ${c.kind}: ${c.detail}`));
  expect(failed).toEqual([]);
  expect(r.ok).toBe(true);
}, 60_000);
