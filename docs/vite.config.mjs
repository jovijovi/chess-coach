import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  base: "./",
  appType: "mpa",
  build: {
    outDir: fileURLToPath(new URL("../output/docs", import.meta.url)),
  },
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
});
