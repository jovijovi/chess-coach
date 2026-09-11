import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  root: "plugins/chess-coach/ui",
  plugins: [react()],
  build: { cssMinify: "esbuild", outDir: "../dist/public", emptyOutDir: true },
});
