import { VitePWA } from "vite-plugin-pwa";

export const pwa = VitePWA({
  registerType: "autoUpdate",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
  },
  includeAssets: ["logo.png"],
  manifest: {
    name: "Oh My Resume",
    short_name: "OhMyResume",
    description: "Create beautiful resumes with ease",
    theme_color: "#ffffff",
    icons: [
      {
        src: "logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
});
