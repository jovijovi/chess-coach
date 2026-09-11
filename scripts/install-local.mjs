import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import {
  cp,
  mkdir,
  readFile,
  writeFile,
  access,
  readdir,
} from "node:fs/promises";
const authorRoot = resolve("plugins/chess-coach");
const preview = process.argv.includes("--dry-run");
const testRootIndex = process.argv.indexOf("--target-home");
const targetHome =
  testRootIndex >= 0 ? resolve(process.argv[testRootIndex + 1]) : homedir();
const pluginPath = join(targetHome, "plugins/chess-coach");
const runtimePath = join(targetHome, ".local/share/chess-coach/runtime");
const marketplacePath = join(targetHome, ".agents/plugins/marketplace.json");
const python = process.env.CHESS_COACH_PYTHON || "/usr/bin/python3";
const helperRoot = join(homedir(), ".codex/skills/.system/plugin-creator");
function run(command, args) {
  const r = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      CHESS_COACH_DATA_DIR: join(targetHome, ".local/share/chess-coach"),
    },
  });
  if (r.error) throw r.error;
  if (r.status !== 0)
    throw new Error(`${command} failed with status ${r.status}`);
}
await access(join(authorRoot, "dist/build-id"));
await access("/usr/bin/flock");
run(python, ["-c", "import yaml"]);
run(python, [join(helperRoot, "scripts/validate_plugin.py"), authorRoot]);
let existing = false;
try {
  await access(join(pluginPath, ".codex-plugin/plugin.json"));
  existing = true;
  const manifest = JSON.parse(
    await readFile(join(pluginPath, ".codex-plugin/plugin.json"), "utf8"),
  );
  if (manifest.name !== "chess-coach")
    throw new Error("Existing plugin path belongs to another plugin");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
let catalog;
try {
  catalog = JSON.parse(await readFile(marketplacePath, "utf8"));
  run(python, [
    join(helperRoot, "scripts/read_marketplace_name.py"),
    "--marketplace-path",
    marketplacePath,
  ]);
  const found = catalog.plugins.find((plugin) => plugin.name === "chess-coach");
  if (
    found &&
    (found.source?.source !== "local" ||
      found.source?.path !== "./plugins/chess-coach")
  )
    throw new Error(
      "An existing chess-coach marketplace entry points elsewhere; resolve it before installing.",
    );
  if (existing && !found)
    throw new Error(
      "Existing plugin has no matching personal marketplace entry.",
    );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const config = {
  mcpServers: {
    "chess-coach": {
      command: process.execPath,
      args: [join(runtimePath, "mcp.js")],
      env: {
        CHESS_COACH_DATA_DIR: join(targetHome, ".local/share/chess-coach"),
      },
    },
  },
};
if (preview) {
  console.log(
    JSON.stringify(
      { pluginPath, runtimePath, marketplacePath, existing, mcp: config },
      null,
      2,
    ),
  );
  process.exit(0);
}
// Stop the old runtime before replacing its resources; the database is a sibling of runtime/.
try {
  await access(join(runtimePath, "control.js"));
  run(process.execPath, [join(runtimePath, "control.js"), "stop"]);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (!existing) {
  try {
    if ((await readdir(pluginPath)).length)
      throw new Error("Target plugin directory is not empty.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  run(python, [
    join(helperRoot, "scripts/create_basic_plugin.py"),
    "chess-coach",
    "--path",
    join(targetHome, "plugins"),
    "--marketplace-path",
    marketplacePath,
    "--with-skills",
    "--with-mcp",
    "--with-marketplace",
  ]);
}
await mkdir(runtimePath, { recursive: true });
await cp(join(authorRoot, "dist"), runtimePath, { recursive: true });
await cp(join(authorRoot, "skills"), join(pluginPath, "skills"), {
  recursive: true,
});
await cp(join(authorRoot, "assets"), join(pluginPath, "assets"), {
  recursive: true,
});
// Preserve the installed version prefix and advance only the supported cachebuster on updates.
const previous = JSON.parse(
  await readFile(join(pluginPath, ".codex-plugin/plugin.json"), "utf8"),
);
const metadata = JSON.parse(
  await readFile(join(authorRoot, ".codex-plugin/plugin.json"), "utf8"),
);
if (existing) metadata.version = previous.version;
await writeFile(
  join(pluginPath, ".codex-plugin/plugin.json"),
  JSON.stringify(metadata, null, 2) + "\n",
);
await writeFile(
  join(pluginPath, ".mcp.json"),
  JSON.stringify(config, null, 2) + "\n",
);
run(python, [
  join(helperRoot, "scripts/update_plugin_cachebuster.py"),
  pluginPath,
]);
run(python, [join(helperRoot, "scripts/validate_plugin.py"), pluginPath]);
const finalCatalog = JSON.parse(await readFile(marketplacePath, "utf8"));
if (testRootIndex < 0)
  run("codex", ["plugin", "add", `chess-coach@${finalCatalog.name}`]);
console.log(`Installed local plugin source at ${pluginPath}`);
console.log(
  `Runtime: ${runtimePath}. Start a new Codex task to load its skills and tools.`,
);
