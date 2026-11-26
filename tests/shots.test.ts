// Screenshots of the proofs: each scenario's final screen, as the page set it.
import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadProject } from "../src/project.ts";
import { captureScreens, changedScreens, inlineImages, junitTests, renderShots, takeShots, visualNodes } from "../src/shots.ts";
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

test.skipIf(!installed)("a test that adds something outside the component still pictures the whole screen", async () => {
  const { writeFileSync, rmSync } = await import("node:fs");
  const file = join(KATA, "checks", "zz-shots-leftover.test.tsx");
  writeFileSync(file, `import { test } from "bun:test";
import { render } from "@testing-library/react";
test("leaves a link behind", () => {
  render(<section><h2>Browser</h2></section>);
  const a = document.createElement("a"); a.textContent = "Open play"; document.body.appendChild(a);
});
`);
  try {
    const [screen] = captureScreens(loadProject(KATA), file);
    expect(screen!.html).toContain("<h2>Browser</h2>");
    expect(screen!.html).toContain("Open play");
  } finally { rmSync(file); }
});

test("images a test imported from disk are inlined, so the screenshot shows them", () => {
  const png = join(KATA, "..", "..", "docs", "cover.png");
  const html = inlineImages(`<img src="${png}" alt="a"><img src="/nope.png">`);
  expect(html).toContain('src="data:image/png;base64,');
  expect(html).toContain('src="/nope.png"');
});

test.skipIf(!installed || !chromium)("retaking a node's screenshots keeps the old ones in place while its tests run, since a page can import them", async () => {
  const { cpSync, readdirSync, symlinkSync, writeFileSync } = await import("node:fs");
  const { refreshNodeShots, nodeShotsDir } = await import("../src/shots.ts");
  const dir = mkdtempSync(join(tmpdir(), "ail-retake-test-"));
  cpSync(KATA, dir, { recursive: true, filter: (f) => !f.includes("node_modules") });
  symlinkSync(join(KATA, "node_modules"), join(dir, "node_modules"));
  const p = loadProject(dir);
  const n = p.nodes.get("StatusLine")!;
  const shotsDir = nodeShotsDir(p, n);
  const own = readdirSync(shotsDir).find((f) => f.endsWith(".png"))!;
  // The check imports one of the node's own screenshots, as a page that shows them (through the spec module) does.
  const check = derivedCheckFile(p, n).file!;
  writeFileSync(check, `import ownShot from ${JSON.stringify(join(shotsDir, own))};\nvoid ownShot;\n` + readFileSync(check, "utf8"));
  const shots = await refreshNodeShots(p, n);
  expect(shots.length).toBe(3);
  expect(readdirSync(shotsDir).filter((f) => f.endsWith(".png")).length).toBe(3);
});
