import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: ['es2015', 'chrome79', 'firefox78', 'safari13', 'edge88'],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-icon.png"],
      manifest: {
        name: "RedFlaq - Instant Criminal Record Verification",
        short_name: "RedFlaq",
        description: "Verify criminal records in South Africa. Instant background checks for R99.",
        theme_color: "#7C3AED",
        background_color: "#FFFFFF",
        display: "standalone",
        start_url: "/",
        orientation: "portrait-primary",
        categories: ["safety", "utilities", "security"],
        icons: [
          {
            src: "pwa-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "New Verification",
            short_name: "Verify",
            description: "Start a new background check",
            url: "/dashboard/new-check",
            icons: [{ src: "pwa-icon.png", sizes: "512x512" }],
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
