import { cp, mkdir, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";
import { archive, listFiles } from "./lib/archive.mjs";
import { embeddedNetworkOffset } from "./lib/wasm-memory.mjs";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = async (path) => JSON.parse(await readFile(path, "utf8"));
const pkg = await json("package.json");
if (!/^\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/.test(pkg.version))
  throw new Error("Use a stable version or an rc.N prerelease.");
const channel = pkg.version.includes("-rc.")
  ? "chess-coach-preview"
  : "chess-coach";
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const dirty = Boolean(
  execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim(),
);
if (
  (process.argv.includes("--release") ||
    process.env.CHESS_COACH_RELEASE === "1") &&
  dirty
)
  throw new Error("Release packaging requires a clean checkout.");
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
const root = resolve("output/release");
const tree = join(root, "marketplace");
const plugin = join(tree, "plugins/chess-coach");
await rm(root, { recursive: true, force: true });
await mkdir(plugin, { recursive: true });
const author = "plugins/chess-coach";
for (const name of [
  "plugin.json",
  "mcp.json",
  ".mcp.json",
  ".codex-plugin",
  "dist",
  "scripts",
  "skills",
  "assets",
])
  await cp(join(author, name), join(plugin, name), { recursive: true });
for (const file of [
  "plugin.json",
  ".codex-plugin/plugin.json",
  "dist/runtime.json",
  "dist/package.json",
])
  if ((await json(join(plugin, file))).version !== pkg.version)
    throw new Error(`Version mismatch: ${file}`);
for (const name of [
  "LICENSE",
  "NOTICE",
  "README.md",
  "README.zh-CN.md",
  "THIRD_PARTY_NOTICES.md",
  "THIRD_PARTY_NOTICES.zh-CN.md",
])
  await cp(name, join(plugin, name));
await mkdir(join(plugin, "release"), { recursive: true });
for (const name of [
  "README.md",
  "README.zh-CN.md",
  "STOCKFISH-SOURCE.md",
  "STOCKFISH-SOURCE.zh-CN.md",
  "ACCEPTANCE.md",
  "ACCEPTANCE.zh-CN.md",
])
  await cp(join("release", name), join(plugin, "release", name));
await cp("AGENTS.md", join(plugin, "AGENTS.md"));
for (const name of ["README.md", "README.zh-CN.md"])
  await writeFile(
    join(plugin, name),
    (await readFile(join(plugin, name), "utf8")).replaceAll(
      "plugins/chess-coach/",
      "",
    ),
  );
const pin = await json("release/stockfish.json");
const lock = await json("package-lock.json");
if (
  lock.packages["node_modules/stockfish"].version !== pin.version ||
  lock.packages["node_modules/stockfish"].integrity !== pin.npmIntegrity
)
  throw new Error(
    "Stockfish package identity changed; review its corresponding source before release.",
  );
for (const kind of ["js", "wasm"])
  if (
    hash(
      await readFile(
        join(plugin, `dist/engine/stockfish-18-lite-single.${kind}`),
      ),
    ) !== pin[`${kind}Sha256`]
  )
    throw new Error(`Stockfish ${kind} hash mismatch`);
const materials = join(plugin, "licenses/stockfish");
await mkdir(materials, { recursive: true });
await mkdir("output/vendor", { recursive: true });
for (const asset of [pin.source, pin.network]) {
  const cached = join("output/vendor", asset.name);
  let bytes;
  try {
    bytes = await readFile(cached);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!bytes) {
    const response = await fetch(asset.url, {
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok)
      throw new Error(
        `Could not obtain corresponding source: ${asset.name} (${response.status})`,
      );
    bytes = Buffer.from(await response.arrayBuffer());
  }
  if (hash(bytes) !== asset.sha256)
    throw new Error(`Corresponding-source checksum mismatch: ${asset.name}`);
  await writeFile(cached, bytes);
  await writeFile(join(materials, asset.name), bytes);
}
const netOffset = embeddedNetworkOffset(
  await readFile(join(plugin, "dist/engine/stockfish-18-lite-single.wasm")),
  await readFile(join(materials, pin.network.name)),
);
if (netOffset < 0)
  throw new Error("The provided network does not match the distributed WASM.");
for (const name of ["STOCKFISH-SOURCE.md", "STOCKFISH-SOURCE.zh-CN.md"])
  await cp(`release/${name}`, join(materials, name));
const dependencies = [];
for (const [path, dependency] of Object.entries(lock.packages).sort(
  ([a], [b]) => a.localeCompare(b, "en"),
)) {
  if (!path || dependency.dev) continue;
  const metadata = await json(join(path, "package.json"));
  const legalFiles = (await readdir(path)).filter((name) =>
    /^(licen[sc]e|copying|notice)(\.|$)/i.test(name),
  );
  if (!legalFiles.length)
    throw new Error(`Missing dependency license text: ${path}`);
  const directory = join(
    plugin,
    "licenses/dependencies",
    `${metadata.name.replaceAll("/", "__")}@${metadata.version}`,
  );
  await mkdir(directory, { recursive: true });
  for (const name of legalFiles)
    await cp(join(path, name), join(directory, name), { recursive: true });
  dependencies.push({
    name: metadata.name,
    version: metadata.version,
    license: dependency.license ?? metadata.license,
    integrity: dependency.integrity,
  });
}
const runtime = await json(join(plugin, "dist/runtime.json"));
const sources = {
  name: "chess-coach",
  version: pkg.version,
  buildId: runtime.buildId,
  sourceCommit,
  dirty,
  repository: pkg.repository.url,
  nodeMinimum: 26,
  codexBaseline: "0.154.0",
  platforms: ["linux-x64", "darwin-x64", "darwin-arm64"],
  stockfish: { ...pin, embeddedNetworkMemoryOffset: netOffset },
  dependencies,
};
await writeFile(
  join(plugin, "sources.json"),
  JSON.stringify(sources, null, 2) + "\n",
);
const integrity = {};
for (const name of await listFiles(plugin))
  integrity[name] = hash(await readFile(join(plugin, name)));
await writeFile(
  join(plugin, "checksums.json"),
  JSON.stringify(integrity, null, 2) + "\n",
);
await mkdir(join(tree, ".agents/plugins"), { recursive: true });
await writeFile(
  join(tree, ".agents/plugins/marketplace.json"),
  JSON.stringify(
    {
      name: channel,
      interface: {
        displayName:
          channel === "chess-coach" ? "Chess Coach" : "Chess Coach Preview",
      },
      plugins: [
        {
          name: "chess-coach",
          source: { source: "local", path: "./plugins/chess-coach" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Productivity",
        },
      ],
    },
    null,
    2,
  ) + "\n",
);
const filename = `chess-coach-${pkg.version}.tar.gz`;
const bytes = await archive(tree);
await writeFile(join(root, filename), bytes);
await writeFile(
  join(root, "sources.json"),
  JSON.stringify(sources, null, 2) + "\n",
);
await writeFile(
  join(root, "SHA256SUMS"),
  `${hash(bytes)}  ${filename}\n${hash(await readFile(join(root, "sources.json")))}  sources.json\n`,
);
console.log(
  `Packaged ${pkg.version}: ${root}\nMarketplace: ${channel}; source: ${sourceCommit}${dirty ? " (development checkout)" : ""}`,
);
