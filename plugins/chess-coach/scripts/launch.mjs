import { spawn } from "node:child_process";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

// Keep this entry compatible with older Node releases so diagnostics remain readable.
try {
  if (Number(process.versions.node.split(".")[0]) < 26)
    throw new Error(
      `Chess Coach requires Node.js 26 or newer; found ${process.version}. Install Node.js 26+ and restart Codex.`,
    );
  if (!(
    (process.platform === "linux" && process.arch === "x64") ||
    (process.platform === "darwin" && ["x64", "arm64"].includes(process.arch))
  ))
    throw new Error(
      `Chess Coach does not support ${process.platform}/${process.arch}. Supported: Linux x64 and macOS x64/arm64.`,
    );
  process.umask(0o077);
  const root = fileURLToPath(new URL("../", import.meta.url));
  const files = JSON.parse(
    await readFile(join(root, "checksums.json"), "utf8"),
  );
  for (const [name, expected] of Object.entries(files)) {
    if (
      name.startsWith("/") ||
      name.includes("\\") ||
      name.split("/").includes("..")
    )
      throw new Error("Invalid package checksum path. Reinstall the plugin.");
    const actual = createHash("sha256")
      .update(await readFile(join(root, name)))
      .digest("hex");
    if (actual !== expected)
      throw new Error(
        `Package resource verification failed: ${name}. Reinstall the plugin.`,
      );
  }
  const { activate, control } = await import("../dist/activation.js");
  const command = process.argv[2];
  if (command && command !== "open") {
    console.log(JSON.stringify(await control(command), null, 2));
  } else {
    const directory = await activate();
    const entry = command === "open" ? "control.js" : "mcp.js";
    const child = spawn(
      process.execPath,
      [join(directory, entry), ...(command ? [command] : [])],
      {
        cwd: directory,
        stdio: "inherit",
        env: process.env,
      },
    );
    for (const signal of ["SIGTERM", "SIGINT"])
      process.on(signal, () => child.kill(signal));
    child.on("error", (error) => {
      console.error(`Chess Coach: ${error.message}`);
      process.exitCode = 1;
    });
    child.on("exit", (code) => {
      process.exitCode = code ?? 1;
    });
  }
} catch (error) {
  console.error(`Chess Coach: ${error.message}`);
  if (error.cause) console.error(`Cause: ${error.cause.message}`);
  process.exitCode = 1;
}
