import axios from "axios";

// -- Shared Types --
export interface PluginInputField {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface PluginSpec {
  name: string;
  description?: string;
  module?: string;
  class?: string;
}

export interface PluginExecution {
  id: number;
  plugin_name: string;
  input_data: Record<string, unknown>;
  output_data: unknown;
  status: string;
  timestamp: string;
}

// 🔍 List all available plugins
export const fetchPlugins = async (): Promise<PluginSpec[]> => {
  const response = await axios.get("/api/v1/plugins");
  const data = response.data;
  return Array.isArray(data?.data?.plugins) ? data.data.plugins : [];
};

// 📋 Get plugin input spec
export const fetchPluginSpec = async (
  pluginName: string
): Promise<PluginInputField[]> => {
  const response = await axios.get(`/api/v1/plugins/${pluginName}/spec`);
  const data = response.data;
  return Array.isArray(data?.data?.input_spec) ? data.data.input_spec : [];
};

// 📜 Fetch plugin execution history
export const fetchPluginHistory = async (): Promise<PluginExecution[]> => {
  const response = await axios.get("/api/v1/plugin/history");
  const data = response.data;
  return Array.isArray(data?.data) ? data.data : [];
};

// 🧠 Execute a plugin with dynamic inputs
export const runPlugin = async (
  pluginName: string,
  inputs: Record<string, unknown>
): Promise<unknown> => {
  const payload = { ...inputs };

  if (import.meta.env.MODE === "development") {
    console.log("📤 Running plugin with payload:", payload);
  }

  const response = await axios.post(`/api/v1/plugins/run/${pluginName}`, payload);
  const data = response.data;
  return data?.data?.result ?? data?.data ?? "No result";
};

// 🧪 Format plugin output
export const formatPluginResult = (result: unknown): string => {
  if (typeof result === "object") {
    return JSON.stringify(result, null, 2);
  }
  return String(result);
};
