import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pwa } from "./src/configs/pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ohmycv/case-police": path.resolve(
        __dirname,
        "./src/libs/case-police/src/index.ts"
      ),
      "@ohmycv/dynamic-css": path.resolve(
        __dirname,
        "./src/libs/dynamic-css/src/index.ts"
      ),
      "@ohmycv/front-matter": path.resolve(
        __dirname,
        "./src/libs/front-matter/src/index.ts"
      ),
      "@ohmycv/google-fonts-loader": path.resolve(
        __dirname,
        "./src/libs/google-fonts-loader/src/index.ts"
      ),
      "@ohmycv/markdown-it-cross-ref": path.resolve(
        __dirname,
        "./src/libs/markdown-it-cross-ref/src/index.ts"
      ),
      "@ohmycv/markdown-it-katex": path.resolve(
        __dirname,
        "./src/libs/markdown-it-katex/src/index.ts"
      ),
      "@ohmycv/markdown-it-latex-cmds": path.resolve(
        __dirname,
        "./src/libs/markdown-it-latex-cmds/src/index.ts"
      ),
      "@ohmycv/react-smart-pages": path.resolve(
        __dirname,
        "./src/libs/react-smart-pages/src/index.ts"
      ),
      "@ohmycv/react-zoom": path.resolve(
        __dirname,
        "./src/libs/react-zoom/src/index.tsx"
      ),
      "@renovamen/utils": path.resolve(__dirname, "./src/utils/index.ts")
    }
  }
});
