// File: src/lib/utils/api.ts
import axios from "axios";

// Handles:
// - `import.meta.env.VITE_API_BASE_URL` (Vite dev mode)
// - `process.env.API_BASE_URL` (Vitest or Node test mode)
// - fallback for safety
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "https://localhost:8000",
});

export default api;

export const unwrapApiResponse = <T>(res: any): T => res.data;
