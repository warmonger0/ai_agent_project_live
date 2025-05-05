import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.50.142:8000", // ✅ correct, no /api/v1 here
});

export default api;

export const unwrapApiResponse = <T>(res: any): T => res.data;
