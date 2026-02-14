import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { pwa } from "./src/configs/pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
