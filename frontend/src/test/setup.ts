// File: src/test/setup.ts

process.env.API_BASE_URL = "https://localhost:8000";

// Optional: ignore TLS warnings if using self-signed certs in test
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "@testing-library/jest-dom/vitest";
