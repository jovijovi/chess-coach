import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import type { GameView } from "../../plugins/chess-coach/src/types";
import {
  dictionaries,
  translate,
  type Locale,
} from "../../plugins/chess-coach/ui/i18n";
let dir: string, boardUrl: string, token: string, origin: string;
const control = resolve("plugins/chess-coach/dist/control.js");
async function api(name: string, args = {}) {
  const result = await fetch(origin + "/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, args }),
  });
  const body = await result.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  return body.result;
}
async function preference(locale?: Locale) {
  const response = await fetch(origin + "/preferences", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(locale ? { method: "POST", body: JSON.stringify({ locale }) } : {}),
  });
  return response.json();
}
async function idle() {
  await expect
    .poll(async () => (await api("get_game")).phase)
    .toBe("player_turn");
}
async function clickMove(page: Page, from: string, to: string) {
  await page.locator(`[data-square="${from}"]`).click();
  await page.locator(`[data-square="${to}"]`).click();
}
async function reset() {
  const game: GameView = await api("get_game");
  await api("new_game", {
    gameId: game.gameId,
    expectedRevision: game.revision,
    playerColor: "w",
    difficulty: "easy",
  });
}
test.beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "chess-browser-"));
  boardUrl = JSON.parse(
    execFileSync(process.execPath, [control, "open"], {
      env: { ...process.env, CHESS_COACH_DATA_DIR: dir },
      encoding: "utf8",
    }),
  ).result.url;
  const info = JSON.parse(readFileSync(join(dir, "server.json"), "utf8"));
  token = info.token;
  origin = `http://127.0.0.1:${info.port}`;
});
test.afterAll(() => {
  execFileSync(process.execPath, [control, "stop"], {
    env: { ...process.env, CHESS_COACH_DATA_DIR: dir },
  });
  rmSync(dir, { recursive: true, force: true });
});
for (const locale of ["en", "zh-CN"] as const) {
  test.describe(locale, () => {
    test.use({ locale });
    const t = dictionaries[locale];
    test.beforeEach(async ({ page }) => {
      await reset();
      await preference(locale);
      await page.goto(boardUrl);
      await expect(
        page.getByRole("heading", { name: t.yourTurn }),
      ).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
    test("click moves, synchronizes two pages, hints, undo, refresh, and export", async ({
      page,
      context,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const second = await context.newPage();
      await second.goto(boardUrl);
      await clickMove(page, "e2", "e4");
      await idle();
      await expect(page.getByTestId("move-list")).toContainText("e4");
      await expect(second.getByTestId("move-list")).toHaveText(
        (await page.getByTestId("move-list").textContent()) ?? "",
      );
      await page.reload();
      await expect(page.getByTestId("move-list")).toContainText("e4");
      await page.getByRole("button", { name: t.hint }).click();
      await expect(
        page.getByRole("heading", { name: t.candidate }),
      ).toBeVisible({ timeout: 15000 });
      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: t.export }).click();
      expect((await download).suggestedFilename()).toMatch(/\.pgn$/);
      await page.getByRole("button", { name: t.undo }).click();
      await expect(page.getByTestId("move-list")).toContainText(t.emptyMoves);
      await expect(
        page.getByRole("heading", { name: t.candidate }),
      ).toHaveCount(0);
      expect(errors).toEqual([]);
    });
    test("dragging, flipping and new-game controls work", async ({ page }) => {
      const from = await page.locator('[data-square="d2"]').boundingBox(),
        to = await page.locator('[data-square="d4"]').boundingBox();
      await page.mouse.move(
        from!.x + from!.width / 2,
        from!.y + from!.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height / 2, {
        steps: 12,
      });
      await page.mouse.up();
      await expect(page.getByTestId("move-list")).toContainText("d4");
      await idle();
      const before = await page.locator('[data-square="a1"]').boundingBox();
      await page.getByRole("button", { name: t.flip }).click();
      expect(
        (await page.locator('[data-square="a1"]').boundingBox())!.y,
      ).toBeLessThan(before!.y);
      await page.getByRole("button", { name: t.newGame }).click();
      await page.getByLabel(t.chooseColor).selectOption("b");
      await page.getByLabel(t.difficulty).selectOption("easy");
      await page.getByRole("button", { name: t.replaceAndNew }).click();
      await idle();
      expect((await api("get_game")).playerColor).toBe("b");
      expect((await api("get_game")).moves).toHaveLength(1);
    });
    test("keyboard moves and responsive layouts stay usable", async ({
      page,
    }) => {
      await page
        .getByRole("button", {
          name: translate(locale, "pieceSquare", {
            square: "e2",
            color: t.whitePiece,
            piece: t.pawn,
          }),
          exact: true,
        })
        .focus();
      await page.keyboard.press("Enter");
      await page
        .getByRole("button", {
          name: translate(locale, "vacantSquare", {
            square: "e4",
            empty: t.emptySquare,
          }),
          exact: true,
        })
        .focus();
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("move-list")).toContainText("e4");
      await idle();
      await expect(
        page.getByRole("heading", { name: t.yourTurn }),
      ).toBeVisible();
      // Let the piece animation finish before capturing visual evidence.
      await page.waitForTimeout(250);
      mkdirSync("output/playwright", { recursive: true });
      await page.screenshot({
        path: `output/playwright/chess-${locale}-desktop.png`,
        fullPage: true,
      });
      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await expect(
          page.getByRole("button", { name: t.newGame }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      await page.screenshot({
        path: `output/playwright/chess-${locale}-mobile.png`,
        fullPage: true,
      });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.screenshot({
        path: `output/playwright/chess-${locale}-dark.png`,
        fullPage: true,
      });
    });
    test("switches all dialog and error text, remembers the choice, and leaves the game unchanged", async ({
      page,
    }) => {
      const before = await api("get_game");
      await clickMove(page, "e2", "e5");
      await expect(page.getByRole("alert")).toContainText(t.errorIllegalMove);
      const other: Locale = locale === "en" ? "zh-CN" : "en",
        translated = dictionaries[other];
      await page
        .getByRole("combobox", { name: t.language, exact: true })
        .selectOption(other);
      await expect(page.locator("html")).toHaveAttribute("lang", other);
      await expect(page).toHaveTitle(translated.pageTitle);
      await expect(page.getByRole("alert")).toContainText(
        translated.errorIllegalMove,
      );
      await expect(
        page.getByRole("heading", { name: translated.yourTurn }),
      ).toBeVisible();
      await expect.poll(async () => (await preference()).locale).toBe(other);
      await page
        .getByRole("button", { name: translated.help, exact: true })
        .click();
      await expect(page.getByRole("dialog")).toContainText(
        translated.helpLanguage,
      );
      await page.getByRole("button", { name: translated.gotIt }).click();
      await page.getByRole("button", { name: translated.newGame }).click();
      await expect(page.getByRole("dialog")).toContainText(
        translated.newHeading,
      );
      await expect(page.getByLabel(translated.chooseColor)).toBeVisible();
      await page
        .getByRole("button", { name: translated.cancel, exact: true })
        .click();
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("lang", other);
      const after = await api("get_game");
      expect(after.gameId).toBe(before.gameId);
      expect(after.revision).toBe(before.revision);
      expect(after.pgn).toBe(before.pgn);
    });
    test("localizes server errors without displaying English diagnostics", async ({
      page,
    }) => {
      await page.route("**/api", async (route) => {
        if (route.request().postDataJSON()?.name === "make_move")
          await route.fulfill({
            status: 409,
            contentType: "application/json",
            body: JSON.stringify({
              error: {
                code: "STALE_STATE",
                message: "Unlocalized server diagnostic",
              },
            }),
          });
        else await route.continue();
      });
      await clickMove(page, "e2", "e4");
      await expect(page.getByRole("alert")).toContainText(t.errorStaleState);
      await expect(page.getByRole("alert")).not.toContainText(
        "Unlocalized server diagnostic",
      );
    });
  });
}
for (const browserLocale of ["en-GB", "zh-TW", "fr-FR"]) {
  test.describe(`browser preference ${browserLocale}`, () => {
    test.use({ locale: browserLocale });
    test("detects supported languages or falls back to English", async ({
      page,
    }) => {
      await reset();
      await page.route("**/preferences", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ locale: null }),
        }),
      );
      await page.goto(boardUrl);
      const expected = browserLocale.startsWith("zh") ? "zh-CN" : "en";
      await expect(page.locator("html")).toHaveAttribute("lang", expected);
      await expect(
        page.getByRole("heading", { name: dictionaries[expected].yourTurn }),
      ).toBeVisible();
    });
  });
}
