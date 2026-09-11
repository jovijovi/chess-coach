import { build } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, cp, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const dist = "plugins/chess-coach/dist";
await mkdir(`${dist}/engine`, { recursive: true });
await build({
  entryPoints: ["daemon", "mcp", "control"].map(
    (name) => `plugins/chess-coach/src/${name}.ts`,
  ),
  outdir: dist,
  platform: "node",
  target: "node26",
  format: "esm",
  bundle: true,
  sourcemap: true,
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
});
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
await writeFile(`${dist}/package.json`, JSON.stringify({ type: "module" }));
const hash = createHash("sha256");
for (const name of ["daemon", "mcp", "control"])
  hash.update(await readFile(`${dist}/${name}.js`));
hash.update(await readFile(`${dist}/public/index.html`));
await writeFile(`${dist}/build-id`, hash.digest("hex"));
console.log("Built self-contained plugin runtime.");
