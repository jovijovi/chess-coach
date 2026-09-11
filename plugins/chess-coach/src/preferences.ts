import { readFileSync, writeFileSync, renameSync } from "node:fs";
export type PreferredLocale = "en" | "zh-CN";
export class Preferences {
  locale: PreferredLocale | null = null;
  constructor(private path: string) {
    try {
      const value = JSON.parse(readFileSync(path, "utf8"));
      if (value?.locale === "en" || value?.locale === "zh-CN")
        this.locale = value.locale;
    } catch (error) {
      if (
        !(error instanceof SyntaxError) &&
        (error as NodeJS.ErrnoException).code !== "ENOENT"
      )
        throw error;
    }
  }
  setLocale(locale: PreferredLocale) {
    // A single daemon serializes writes; atomic replacement keeps preferences independent of game data.
    writeFileSync(this.path + ".tmp", JSON.stringify({ locale }), {
      mode: 0o600,
    });
    renameSync(this.path + ".tmp", this.path);
    this.locale = locale;
  }
}
