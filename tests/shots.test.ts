// Screenshots of the proofs: each scenario's final screen, as the page set it.
import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadProject } from "../src/project.ts";
import { captureScreens, changedScreens, junitTests, renderShots, takeShots, visualNodes } from "../src/shots.ts";
import { derivedCheckFile } from "../src/verify.ts";
import { KATA } from "./helpers.ts";

const installed = existsSync(join(KATA, "node_modules", "react"));
const chromium = await import("playwright").then(async ({ chromium }) => { await (await chromium.launch()).close(); return true; }).catch(() => false);

test("JUnit test names come back in order, unescaped, without skipped tests", () => {
  const xml = `<testsuite><testcase name="a &amp; b" classname=""/><testcase name="skipped" classname=""><skipped/></testcase><testcase name="it&apos;s &quot;c&quot;" classname=""></testcase></testsuite>`;
  expect(junitTests(xml)).toEqual(["a & b", `it's "c"`]);
});

test("a change is pictured in the changed node and in the nodes that use it directly", () => {
  const p = loadProject(KATA);
  expect(changedScreens(p, ["BoardView"])).toEqual(expect.arrayContaining(["BoardView", "PlayAGame", "WatchADemo"]));
  expect(changedScreens(p, ["BoardView"])).not.toContain("TicTacToe");
  expect(visualNodes(p).map((n) => n.name)).toContain("BoardView");
  expect(visualNodes(p).map((n) => n.name)).not.toContain("Rules"); // no look
});

test("screenshots are linked from the review under the given base", () => {
  const md = renderShots([{ node: "BoardView", test: "a win", file: "/out/board/board-view/01-a-win.png" }], "/out", "https://x.test/shots/");
  expect(md).toContain(`<img src="https://x.test/shots/board/board-view/01-a-win.png"`);
  expect(md).toContain("<b>BoardView</b> — 1 screen(s)");
});

test.skipIf(!installed)("each test's final screen is captured with the styles the page set", () => {
  const p = loadProject(KATA);
  const screens = captureScreens(p, derivedCheckFile(p, p.nodes.get("BoardView")!).file!);
  expect(screens.map((s) => s.test)).toEqual(["picking an empty square", "a taken square does nothing", "the winning line stands out"]);
  const win = screens[2]!.html;
  expect(win).toContain("var(--color-highlight)");
  // happy-dom would serialize `border: none` as invalid longhands; the page's own value survives
  expect(win).not.toContain("border-color: none");
});

test.skipIf(!installed || !chromium)("screenshots are rendered for every scenario of a node with a look", async () => {
  const out = mkdtempSync(join(tmpdir(), "ail-shots-test-"));
  const shots = await takeShots(loadProject(KATA), out, ["StatusLine"]);
  expect(shots.length).toBe(3);
  for (const s of shots) expect(readFileSync(s.file).subarray(1, 4).toString()).toBe("PNG");
  expect(JSON.parse(readFileSync(join(out, "shots.json"), "utf8")).length).toBe(3);
}, 60_000);
