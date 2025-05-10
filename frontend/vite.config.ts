// File: frontend/vite.config.ts

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // enables modern JSX transform
    }),
    tsconfigPaths(), // resolves paths in tsconfig.json
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // enables "@/..." imports
    },
  },
  build: {
    sourcemap: true, // ✅ Enables source maps for better debugging
  },
  define: {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })", // silences devtools in tests
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts", // if you use it
  },
});
