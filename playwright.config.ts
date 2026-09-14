import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 30000,
  use: {
    headless: true,
    viewport: { width: 1200, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath:
        process.env.CHESS_COACH_CHROME ||
        (existsSync("/opt/google/chrome/chrome")
          ? "/opt/google/chrome/chrome"
          : undefined),
      args: ["--no-sandbox"],
    },
  },
  reporter: "list",
  outputDir: "output/playwright/test-results",
});
