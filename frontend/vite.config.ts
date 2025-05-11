// File: vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
<<<<<<< Updated upstream
  define: {
    // Make VITE_API_BASE_URL available to frontend via import.meta.env
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      "https://war.myddns.me:8000"
    ),
  },
=======
>>>>>>> Stashed changes
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.pem")),
    },
<<<<<<< Updated upstream
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://192.168.50.142:8000", // local backend target
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
=======
    host: "0.0.0.0",
    port: 5173,
>>>>>>> Stashed changes
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
