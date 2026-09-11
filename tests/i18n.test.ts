import { describe, expect, it } from "vitest";
import {
  dictionaries,
  detectLocale,
  translate,
  errorKey,
  isLocale,
} from "../plugins/chess-coach/ui/i18n";
import type { MessageKey } from "../plugins/chess-coach/ui/locales/en";
import { Preferences } from "../plugins/chess-coach/src/preferences";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("language selection and translations", () => {
  it.each([
    [["zh-CN"], "zh-CN"],
    [["zh-TW", "en-US"], "zh-CN"],
    [["en-GB", "zh-CN"], "en"],
    [["fr-FR", "zh-Hant"], "zh-CN"],
    [["ja-JP"], "en"],
    [[], "en"],
  ])(
    "selects the first supported browser language from %j",
    (languages, expected) => {
      expect(detectLocale(languages)).toBe(expected);
    },
  );
  it("rejects invalid persisted locale identifiers", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh-CN")).toBe(true);
    expect(isLocale("zh-TW")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
  it("keeps message keys and interpolation placeholders aligned", () => {
    expect(Object.keys(dictionaries.en).sort()).toEqual(
      Object.keys(dictionaries["zh-CN"]).sort(),
    );
    for (const key of Object.keys(dictionaries.en) as MessageKey[]) {
      const english = dictionaries.en[key],
        chinese = dictionaries["zh-CN"][key];
      expect(english.trim(), key).not.toBe("");
      expect(chinese.trim(), key).not.toBe("");
      expect(english.match(/\{\w+\}/g)?.sort() ?? [], key).toEqual(
        chinese.match(/\{\w+\}/g)?.sort() ?? [],
      );
    }
    expect(translate("en", "roundNumber", { count: 26 })).toBe("Move 26");
    expect(translate("en", "mateDistance", { count: -1 })).toBe(
      "Mate distance -1",
    );
  });
  it("maps stable error codes instead of exposing server diagnostics", () => {
    expect(
      errorKey({
        code: "STALE_STATE",
        message: "Raw engine or server diagnostic",
      }),
    ).toBe("errorStaleState");
    expect(errorKey({ code: "UNAUTHORIZED" })).toBe("errorUnauthorized");
    expect(errorKey({ code: "CONNECTION" })).toBe("errorConnection");
    expect(errorKey(new Error("Internal detail"))).toBe("errorUnexpected");
  });
});

describe("persistent language preference", () => {
  it("restores choices independently from game data", () => {
    const root = mkdtempSync(join(tmpdir(), "chess-preferences-"));
    try {
      const file = join(root, "preferences.json"),
        game = join(root, "state.db");
      writeFileSync(game, "untouched-game");
      const preferences = new Preferences(file);
      expect(preferences.locale).toBeNull();
      preferences.setLocale("zh-CN");
      expect(new Preferences(file).locale).toBe("zh-CN");
      preferences.setLocale("en");
      expect(new Preferences(file).locale).toBe("en");
      expect(readFileSync(game, "utf8")).toBe("untouched-game");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it.each(["broken-json", "null", '{"locale":"fr"}'])(
    "ignores unsupported or corrupt preferences: %s",
    (content) => {
      const root = mkdtempSync(join(tmpdir(), "chess-preferences-"));
      try {
        const file = join(root, "preferences.json");
        writeFileSync(file, content);
        expect(new Preferences(file).locale).toBeNull();
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );
});
