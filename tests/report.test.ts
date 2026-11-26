// Every check of a build, for a pull request's description.
import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadProject } from "../src/project.ts";
import { githubLink, hasSection, lastReportPath, prSection, projectKey, renderChecks, sectionFor, upsertSection, writeReport, type BuildReport } from "../src/report.ts";
import { junitResults } from "../src/shots.ts";
import { runBunTest } from "../src/verify.ts";
import { KATA } from "./helpers.ts";

const installed = existsSync(join(KATA, "node_modules", "react"));

const report = (over: Partial<BuildReport> = {}): BuildReport => ({
  ok: false, text: "", e2e: null,
  check: {
    ok: false, glue: [], unjudged: [], lint: [], plan: [],
    verify: {
      ok: false, typecheck: { kind: "typecheck", ok: true, severity: "error", detail: "" },
      results: [
        { node: "BoardView", ok: true, checks: [{ kind: "exists", ok: true, severity: "error", detail: "" }, { kind: "tests", ok: true, severity: "error", detail: "2 passed", tests: [{ name: "picking an empty square", ok: true }, { name: "a win <3", ok: true }] }] },
        { node: "Rules", ok: false, checks: [{ kind: "tests", ok: false, severity: "error", detail: "✗ a draw\nexpected 1", tests: [{ name: "a draw", ok: false }] }] },
        { node: "Colors", ok: true, checks: [{ kind: "exists", ok: true, severity: "error", detail: "" }] },
      ],
    },
  },
  ...over,
});

test("JUnit results say which tests passed", () => {
  const xml = `<testcase name="a"/><testcase name="b"><failure message="x"/></testcase><testcase name="c"><skipped/></testcase>`;
  expect(junitResults(xml)).toEqual([{ name: "a", ok: true }, { name: "b", ok: false }]);
});

test.skipIf(!installed)("a test run names every test, passed or failed", () => {
  const r = runBunTest(KATA, ["checks/board/board-view.test.tsx"]);
  expect(r.tests).toEqual([
    { name: "picking an empty square", ok: true }, { name: "a taken square does nothing", ok: true }, { name: "the winning line stands out", ok: true },
  ]);
});

test("every check is a collapsible section, each test with a check mark or a cross", () => {
  const md = renderChecks(loadProject(KATA), report());
  expect(md).toContain("❌ **2 of 3 test(s) passed in 2 check(s)**");
  expect(md).toContain("<details><summary>✅ <b>BoardView</b> — 2/2 passed");
  expect(md).toContain("- ✅ a win &lt;3");
  expect(md).toContain("<details><summary>❌ <b>Rules</b> — 0/1 passed</summary>");
  expect(md).toContain("- ❌ a draw");
  expect(md).toContain("expected 1");
  expect(md).toContain("✅ typecheck");
  expect(md).toContain("✅ 1 other node(s)"); // Colors: no tests, nothing failed
});

test("each test's screen sits under it: the one just taken, else the committed one", () => {
  const p = loadProject(KATA);
  const out = mkdtempSync(join(tmpdir(), "ail-report-"));
  mkdirSync(join(out, "board/board-view"), { recursive: true });
  writeFileSync(join(out, "board/board-view/02-a-win.png"), "");
  const md = renderChecks(p, report(), { outDir: out, base: "https://x.test/s/", shots: [{ node: "BoardView", test: "a win <3", file: join(out, "board/board-view/02-a-win.png") }] });
  expect(md).toContain(`- ✅ a win &lt;3\n\n  <img src="https://x.test/s/board/board-view/02-a-win.png"`);
  // No fresh screen for this one: the build's committed screenshot, copied next to the fresh ones.
  expect(existsSync(join(KATA, "ail/board/shots/board-view/shots.json"))).toBe(true);
  expect(md).toContain(`- ✅ picking an empty square\n\n  <img src="https://x.test/s/ail/board/shots/board-view/01-picking-an-empty-square.png"`);
  expect(existsSync(join(out, "ail/board/shots/board-view/01-picking-an-empty-square.png"))).toBe(true);
});

test("without a place to publish them, only the tests are listed", () => {
  expect(renderChecks(loadProject(KATA), report())).not.toContain("<img");
});

test("a spec with errors says nothing was checked, and why", () => {
  const md = renderChecks(loadProject(KATA), report({ check: null, text: "✗ x.ail.md:3 bad" }));
  expect(md).toContain("the spec has errors, so nothing was checked");
  expect(md).toContain("✗ x.ail.md:3 bad");
});

test("end-to-end checks are sections too, with their screens", () => {
  const md = renderChecks(loadProject(KATA), report({
    e2e: { ok: true, app: "run.app", results: [
      { node: "PlayAGame", file: "checks/e2e/app/play/play-a-game.e2e.ts", status: "pass", detail: "", tests: [{ name: "X always starts", ok: true }], shots: [] },
      { node: "App", file: null, status: "missing", detail: "" },
    ] },
  }));
  expect(md).toContain("<details><summary>✅ <b>PlayAGame · end to end</b> — 1/1 passed</summary>");
  expect(md).not.toContain("App · end to end");
});

test("a project's section in the description is added once, then replaced, leaving the rest alone", () => {
  const first = upsertSection("What this PR does.", "site", "one");
  expect(first).toBe("What this PR does.\n\n<!-- ail-checks:site -->\none\n<!-- /ail-checks:site -->\n");
  const both = upsertSection(first, "examples/tictactoe", "kata");
  const again = upsertSection(both, "site", "two");
  expect(again).toContain("What this PR does.");
  expect(again).toContain("<!-- ail-checks:site -->\ntwo\n<!-- /ail-checks:site -->");
  expect(again).not.toContain("one");
  expect(hasSection(again, "examples/tictactoe", "kata")).toBe(true);
  expect(upsertSection("", "site", "x")).toBe("<!-- ail-checks:site -->\nx\n<!-- /ail-checks:site -->\n");
});

test("a long section is cut short at a whole check", () => {
  const checks = Array.from({ length: 50 }, (_, i) => `<details><summary>${i}</summary>\n\n${"x".repeat(100)}\n\n</details>`).join("\n");
  const s = sectionFor("site", checks, 1000);
  expect(s.length).toBeLessThan(1100);
  expect(s.match(/<details>/g)!.length).toBe(s.match(/<\/details>/g)!.length);
  expect(s).toContain("Cut short");
});

test("screens link to the committed screenshot on GitHub, at the commit the build ran on", () => {
  const p = loadProject(KATA);
  const link = githubLink(p, "abc123");
  if (!link) return; // a checkout without a GitHub origin
  expect(link(join(KATA, "ail/ui/shots/text/01-content-is-shown.png"))).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/abc123\/examples\/tictactoe\/ail\/ui\/shots\/text\/01-content-is-shown\.png\?raw=true$/);
  expect(projectKey(p)).toBe("examples/tictactoe");
});

test("for an agent, the last build's checks come between the markers the GitHub Action uses", () => {
  const p = loadProject(KATA);
  const file = lastReportPath(p);
  const before = existsSync(file) ? readFileSync(file, "utf8") : null;
  try {
    writeReport(file, { ...report(), head: "abc123", dirty: true });
    const out = prSection(p);
    expect(out).toStartWith("! the build ran on uncommitted changes");
    const section = out.slice(out.indexOf("<!--"));
    expect(section).toStartWith("<!-- ail-checks:examples/tictactoe -->\n### AIL checks · `examples/tictactoe`");
    expect(section.trimEnd()).toEndWith("<!-- /ail-checks:examples/tictactoe -->");
    expect(upsertSection(upsertSection("Intro", "examples/tictactoe", "old"), "examples/tictactoe", section.split("\n").slice(1, -2).join("\n"))).toContain("Intro");
  } finally {
    if (before !== null) writeFileSync(file, before); else rmSync(file, { force: true });
  }
});

test("a build that ran only what a change affects says so", () => {
  const p = loadProject(KATA);
  expect(renderChecks(p, report({ affected: { since: "origin/main", nodes: ["BoardView", "Rules"] } }))).toContain("Only the checks of what changed since `origin/main` and what uses it: 2 node(s).");
  expect(renderChecks(p, report({ affected: { since: "origin/main", nodes: [] } }))).toContain("so no tests ran");
  expect(renderChecks(p, report({ affected: { since: "origin/main", nodes: ["Rules"], everything: ["package.json"] } }))).toContain("Every check ran");
});
