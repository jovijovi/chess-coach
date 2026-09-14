import { execFileSync } from "node:child_process";
import { cp, readFile, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
const directory = resolve("output/local-marketplace");
const codex = process.env.CHESS_COACH_CODEX || "codex";
const commands = [
  ["plugin", "marketplace", "add", directory],
  ["plugin", "add", "chess-coach@chess-coach-local"],
];
if (process.argv.includes("--dry-run")) {
  console.log(
    JSON.stringify(
      {
        directory,
        marketplace: "chess-coach-local",
        command: codex,
        commands,
        runtime: "~/.local/share/chess-coach/runtime",
        preservesData: true,
      },
      null,
      2,
    ),
  );
} else {
  const version = execFileSync(codex, ["--version"], {
    encoding: "utf8",
  }).trim();
  console.log(`Installing through ${version}.`);
  execFileSync(process.execPath, ["scripts/package.mjs"], { stdio: "inherit" });
  await rm(directory, { recursive: true, force: true });
  await cp("output/release/marketplace", directory, { recursive: true });
  const path = join(directory, ".agents/plugins/marketplace.json");
  const marketplace = JSON.parse(await readFile(path, "utf8"));
  marketplace.name = "chess-coach-local";
  marketplace.interface.displayName = "Chess Coach Development";
  await writeFile(path, JSON.stringify(marketplace, null, 2) + "\n");
  for (const args of commands) execFileSync(codex, args, { stdio: "inherit" });
  console.log(
    "Installed. Start a new Codex task. Follow the personal migration guide before activating over a legacy runtime.",
  );
}
