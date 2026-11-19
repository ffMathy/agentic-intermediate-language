// ail-derived-from: PlayAGame@618142f73d1810c8
// End-to-end check for PlayAGame: its scenarios, played in a real browser
// against the running app at AIL_APP_URL. It knows nothing of the code, only
// what a player can see and do, so it runs against any build of the app.
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { chromium, type Browser, type Page } from "playwright";

const APP = process.env.AIL_APP_URL ?? "http://localhost:3000";
let browser: Browser;
let page: Page;

beforeAll(async () => { browser = await chromium.launch(); });
afterAll(async () => { await browser.close(); });
beforeEach(async () => {
  page = await browser.newPage();
  await page.goto(APP);
});

/** A square by its index, 0 to 8, read row by row. */
const square = (i: number) => page.getByRole("button", { name: new RegExp(`^Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1},`) });
const pick = async (...squares: number[]) => { for (const i of squares) await square(i).click(); };
const status = (text: string) => page.getByText(text, { exact: true });

test("X always starts", async () => {
  await expect(status("X's turn").isVisible()).resolves.toBe(true);
});

test("taking turns", async () => {
  await pick(4);
  await expect(square(4).getAttribute("aria-label")).resolves.toBe("Row 2, column 2, X");
  await expect(status("O's turn").isVisible()).resolves.toBe(true);
});

test("a taken square can't be picked", async () => {
  await pick(4);
  await square(4).click({ force: true }); // a taken square is disabled: clicking it does nothing
  await expect(square(4).getAttribute("aria-label")).resolves.toBe("Row 2, column 2, X");
  await expect(status("O's turn").isVisible()).resolves.toBe(true);
});

test("winning", async () => {
  await pick(0, 4, 1, 6, 2);
  await expect(status("X wins!").isVisible()).resolves.toBe(true);
  const background = (i: number) => square(i).evaluate((el) => getComputedStyle(el).backgroundColor);
  const top = await Promise.all([0, 1, 2].map(background));
  expect(new Set(top).size).toBe(1);
  expect(await background(5)).not.toBe(top[0]);
});

test("draw", async () => {
  await pick(0, 1, 2, 4, 3, 5, 7, 6, 8);
  await expect(status("It's a draw").isVisible()).resolves.toBe(true);
});

test("new game", async () => {
  await pick(0, 4, 1, 6, 2);
  await page.getByRole("button", { name: "New game" }).click();
  for (let i = 0; i < 9; i++) expect(await square(i).getAttribute("aria-label")).toEndWith(", empty");
  await expect(status("X's turn").isVisible()).resolves.toBe(true);
});

test("the computer answers", async () => {
  await page.getByRole("radio", { name: "Computer" }).click();
  await pick(4);
  await page.getByText("X's turn", { exact: true }).waitFor({ timeout: 3000 });
  const labels = await Promise.all(Array.from({ length: 9 }, (_, i) => square(i).getAttribute("aria-label")));
  expect(labels.filter((l) => l?.endsWith(", O")).length).toBe(1);
}, 10_000);
