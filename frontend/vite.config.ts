import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/logs": "http://localhost:8000",
      "/health": "http://localhost:8000",
      "/status": "http://localhost:8000",
      "/retry": "http://localhost:8000",
      "/plugins": "http://localhost:8000",
      "/plugin": "http://localhost:8000", // ✅ Added: fixes plugin history errors
    },
    fs: {
      allow: [".."], // ✅ allows serving one level up
    },
  },
  appType: "spa", // ✅ ensures index.html fallback
  build: {
    rollupOptions: {
      input: "/index.html", // ✅ correct for single page app
    },
  },
  resolve: {
    alias: {
      "@": "/src", // ✅ clean import alias for /src
    },
  },
});
