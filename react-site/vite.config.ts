import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { pwa } from "./src/configs/pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ohmycv/case-police": path.resolve(
        __dirname,
        "../packages/case-police/dist/index.mjs"
      ),
      "@ohmycv/dynamic-css": path.resolve(
        __dirname,
        "../packages/dynamic-css/dist/index.mjs"
      ),
      "@ohmycv/front-matter": path.resolve(
        __dirname,
        "../packages/front-matter/dist/index.mjs"
      ),
      "@ohmycv/google-fonts-loader": path.resolve(
        __dirname,
        "../packages/google-fonts-loader/dist/index.mjs"
      ),
      "@ohmycv/markdown-it-cross-ref": path.resolve(
        __dirname,
        "../packages/markdown-it-cross-ref/dist/index.mjs"
      ),
      "@ohmycv/markdown-it-katex": path.resolve(
        __dirname,
        "../packages/markdown-it-katex/dist/index.mjs"
      ),
      "@ohmycv/markdown-it-latex-cmds": path.resolve(
        __dirname,
        "../packages/markdown-it-latex-cmds/dist/index.mjs"
      ),
      "@renovamen/utils": path.resolve(__dirname, "../packages/utils/dist/index.mjs")
    }
  }
});
