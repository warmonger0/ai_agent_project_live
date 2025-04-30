import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ✅ Needed for cross-platform aliasing

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/logs": "http://localhost:8000",
      "/health": "http://localhost:8000",
      "/status": "http://localhost:8000",
      "/retry": "http://localhost:8000",
      "/plugins": "http://localhost:8000",
      "/plugin": "http://localhost:8000", // ✅ for plugin history
      "/api/v1": "http://localhost:8000", // ✅ catch-all API proxy
    },
    fs: {
      allow: [".."],
    },
  },
  appType: "spa",
  build: {
    rollupOptions: {
      input: "index.html", // 🔁 don't use absolute path
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ full-safe aliasing
    },
  },
  css: {
    postcss: "./postcss.config.js", // ✅ explicitly declare PostCSS
  },
});
