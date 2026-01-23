import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { pwa } from './src/configs/pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})