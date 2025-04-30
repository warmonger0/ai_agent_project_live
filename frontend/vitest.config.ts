/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // ✅ Needed for React + DOM APIs
    setupFiles: "./vitest.setup.ts", // ✅ for jest-dom, etc.
    globals: true, // ✅ Enables vi, describe, it, expect without importing
  },
});
