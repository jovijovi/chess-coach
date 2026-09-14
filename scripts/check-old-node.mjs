import { spawnSync } from "node:child_process";
const result = spawnSync(
  process.execPath,
  [
    "output/release/marketplace/plugins/chess-coach/scripts/launch.mjs",
    "doctor",
  ],
  { encoding: "utf8" },
);
if (
  result.status !== 1 ||
  result.stdout ||
  !result.stderr.includes("requires Node.js 26 or newer")
)
  throw new Error("Unsupported Node diagnostic failed");
console.log(
  "Older Node exits cleanly with an English prerequisite diagnostic and no stdout.",
);
