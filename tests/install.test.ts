import { expect, it } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
it("installs and updates into an isolated home while preserving the database and marketplace entry", () => {
  const home = mkdtempSync(join(tmpdir(), "chess-install-"));
  try {
    const run = () =>
      execFileSync(
        process.execPath,
        ["scripts/install-local.mjs", "--target-home", home],
        { encoding: "utf8" },
      );
    expect(run()).toContain("Installed local plugin");
    const manifest = join(
      home,
      "plugins/chess-coach/.codex-plugin/plugin.json",
    );
    expect(JSON.parse(readFileSync(manifest, "utf8")).version).toMatch(
      /^0\.1\.0\+codex\./,
    );
    const config = JSON.parse(
      readFileSync(join(home, "plugins/chess-coach/.mcp.json"), "utf8"),
    );
    expect(config.mcpServers["chess-coach"].command).toBe(process.execPath);
    expect(config.mcpServers["chess-coach"].args[0]).toBe(
      join(home, ".local/share/chess-coach/runtime/mcp.js"),
    );
    const data = join(home, ".local/share/chess-coach/state.db");
    writeFileSync(data, "preserved-state");
    const preferences = join(home, ".local/share/chess-coach/preferences.json");
    writeFileSync(preferences, JSON.stringify({ locale: "zh-CN" }));
    expect(run()).toContain("Installed local plugin");
    expect(readFileSync(data, "utf8")).toBe("preserved-state");
    expect(JSON.parse(readFileSync(preferences, "utf8"))).toEqual({
      locale: "zh-CN",
    });
    const catalog = JSON.parse(
      readFileSync(join(home, ".agents/plugins/marketplace.json"), "utf8"),
    );
    expect(
      catalog.plugins.filter((p: { name: string }) => p.name === "chess-coach"),
    ).toHaveLength(1);
    expect(catalog.plugins[0].source.path).toBe("./plugins/chess-coach");
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
