import { readFile, readdir, lstat } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

export type RuntimeManifest = {
  version: string;
  buildId: string;
  protocol: 1;
  files: Record<string, string>;
};
export const sha256 = (bytes: string | Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
export async function readManifest(root: string): Promise<RuntimeManifest> {
  const manifest = JSON.parse(
    await readFile(join(root, "runtime.json"), "utf8"),
  ) as RuntimeManifest;
  if (
    manifest.protocol !== 1 ||
    !/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(manifest.version) ||
    !/^[a-f0-9]{64}$/.test(manifest.buildId) ||
    !manifest.files ||
    sha256(
      JSON.stringify({
        version: manifest.version,
        protocol: manifest.protocol,
        files: manifest.files,
      }),
    ) !== manifest.buildId
  )
    throw new Error(
      "Invalid Chess Coach runtime manifest. Reinstall the plugin.",
    );
  return manifest;
}
export async function verifyRuntime(root: string) {
  const manifest = await readManifest(root);
  const actual: string[] = [];
  async function visit(relative: string) {
    for (const entry of await readdir(join(root, relative), {
      withFileTypes: true,
    })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink())
        throw new Error(`Unexpected symbolic link: ${name}`);
      if (entry.isDirectory()) await visit(name);
      else if (entry.isFile() && name !== "runtime.json") actual.push(name);
      else if (!entry.isFile())
        throw new Error(`Unexpected runtime entry: ${name}`);
    }
  }
  if ((await lstat(root)).isSymbolicLink())
    throw new Error("The runtime directory must not be a symbolic link.");
  await visit("");
  const expected = Object.keys(manifest.files).sort();
  if (JSON.stringify(actual.sort()) !== JSON.stringify(expected))
    throw new Error(
      "Chess Coach runtime files are missing or unexpected. Reinstall the plugin.",
    );
  for (const name of expected) {
    if (
      !/^[a-zA-Z0-9_./-]+$/.test(name) ||
      name.startsWith("/") ||
      name.split("/").includes("..") ||
      sha256(await readFile(join(root, name))) !== manifest.files[name]
    )
      throw new Error(
        `Chess Coach resource verification failed: ${name}. Reinstall the plugin.`,
      );
  }
  return manifest;
}
export function compareVersions(a: string, b: string) {
  const parts = (v: string) => {
    const [core, rc] = v.split("-rc.");
    return [
      ...core.split(".").map(Number),
      rc === undefined ? Infinity : Number(rc),
    ];
  };
  const x = parts(a),
    y = parts(b);
  for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
}
