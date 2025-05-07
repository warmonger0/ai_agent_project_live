import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;

export const unwrapApiResponse = <T>(res: any): T => res.data;
