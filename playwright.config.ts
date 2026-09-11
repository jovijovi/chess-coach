import { defineConfig } from "@playwright/test";
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
        process.env.CHESS_COACH_CHROME || "/opt/google/chrome/chrome",
      args: ["--no-sandbox"],
    },
  },
  reporter: "list",
  outputDir: "output/playwright/test-results",
});
