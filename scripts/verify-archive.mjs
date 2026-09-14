import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = process.argv[2];
for (const line of (await readFile(join(root, "SHA256SUMS"), "utf8"))
  .trim()
  .split("\n")) {
  const match = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
  if (!match) throw new Error("Invalid checksum entry");
  if (
    createHash("sha256")
      .update(await readFile(join(root, match[2])))
      .digest("hex") !== match[1]
  )
    throw new Error(`Checksum mismatch: ${match[2]}`);
}
const sources = JSON.parse(await readFile(join(root, "sources.json"), "utf8"));
await mkdir(join(root, "marketplace"), { recursive: true });
execFileSync("tar", [
  "-xzf",
  join(root, `chess-coach-${sources.version}.tar.gz`),
  "-C",
  join(root, "marketplace"),
]);
