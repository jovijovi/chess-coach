import { spawn } from "node:child_process";
import { resolve } from "node:path";
const build = spawn(process.execPath, ["scripts/build.mjs"], {
  stdio: "inherit",
});
build.on("exit", (code) => {
  if (code) process.exit(code);
  const child = spawn(
    process.execPath,
    ["plugins/chess-coach/dist/control.js", "open"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        CHESS_COACH_DATA_DIR:
          process.env.CHESS_COACH_DATA_DIR ?? resolve("output/dev-data"),
      },
    },
  );
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
});
