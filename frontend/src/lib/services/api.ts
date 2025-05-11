// File: src/lib/utils/api.ts

import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "https://localhost:8000",
  // 👆 Allows override in test or dev; defaults to your new HTTPS backend
});

export default api;

export const unwrapApiResponse = <T>(res: any): T => res.data;
