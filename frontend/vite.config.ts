import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" }), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    // Avoid React devtools issues in test/dev
    __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.pem")),
    },
    host: true, // allows external LAN access
    port: 5173,
  },
});
