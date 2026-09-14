import { build } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, cp, writeFile, readFile, rm, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
const dist = "plugins/chess-coach/dist";
const { version } = JSON.parse(await readFile("package.json", "utf8"));
await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}/engine`, { recursive: true });
const result = await build({
  entryPoints: ["daemon", "mcp", "control", "activation"].map(
    (name) => `plugins/chess-coach/src/${name}.ts`,
  ),
  outdir: dist,
  platform: "node",
  target: "node26",
  format: "esm",
  bundle: true,
  sourcemap: false,
  metafile: true,
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
});
await mkdir("output", { recursive: true });
await writeFile(
  "output/build-inputs.json",
  JSON.stringify(result.metafile.inputs, null, 2),
);
await viteBuild();
await cp(
  "plugins/chess-coach/src/engine-worker.cjs",
  `${dist}/engine-worker.cjs`,
);
for (const suffix of ["js", "wasm"])
  await cp(
    `node_modules/stockfish/bin/stockfish-18-lite-single.${suffix}`,
    `${dist}/engine/stockfish-18-lite-single.${suffix}`,
  );
await writeFile(
  `${dist}/engine/package.json`,
  JSON.stringify({ type: "commonjs" }),
);
await cp("node_modules/stockfish/Copying.txt", `${dist}/engine/COPYING`);
await writeFile(
  `${dist}/package.json`,
  JSON.stringify({ type: "module", version }),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const files = {};
async function visit(relative = "") {
  const entries = await readdir(join(dist, relative), { withFileTypes: true });
  for (const entry of entries.sort((a, b) =>
    a.name.localeCompare(b.name, "en"),
  )) {
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await visit(name);
    else files[name] = hash(await readFile(join(dist, name)));
  }
}
await visit();
const sorted = Object.fromEntries(
  Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1)),
);
await writeFile(
  `${dist}/runtime.json`,
  JSON.stringify(
    {
      version,
      buildId: hash(JSON.stringify({ version, protocol: 1, files: sorted })),
      protocol: 1,
      files: sorted,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Built self-contained Chess Coach ${version}.`);
