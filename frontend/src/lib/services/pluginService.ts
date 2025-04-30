// /frontend/src/lib/services/pluginService.ts

import axios from "axios";

// 🔍 List all available plugins
export const fetchPlugins = async () => {
  const response = await axios.get("/api/v1/plugins");
  const data = response.data;
  return data?.data?.plugins ?? [];
};

// 📜 Fetch plugin execution history
export const fetchPluginHistory = async () => {
  const response = await axios.get("/api/v1/plugin/history");
  const data = response.data;
  return Array.isArray(data?.data) ? data.data : [];
};

// 🧠 Execute a specific plugin (corrected)
export const runPlugin = async (pluginName: string, inputText: string) => {
  const payload = {
    input_text: inputText ?? "",  // ✅ MATCH backend Pydantic schema
  };

  console.log("📤 Running plugin with payload:", payload);

  const response = await axios.post(`/api/v1/plugins/run/${pluginName}`, payload);
  const data = response.data;
  return data?.data?.result ?? data?.data ?? "No result";
};
