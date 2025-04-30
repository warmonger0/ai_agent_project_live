import axios from "axios";
import type {
  PluginSpec,
  PluginInputField,
  PluginExecution,
} from "@/lib/types/plugin";

// 🔍 List all available plugins
export const fetchPlugins = async (): Promise<PluginSpec[]> => {
  const response = await axios.get("/api/v1/plugins");
  const data = response.data;

  if (
    import.meta.env.MODE === "development" &&
    !Array.isArray(data?.data?.plugins)
  ) {
    console.warn("Unexpected plugin list shape:", data);
  }

  return Array.isArray(data?.data?.plugins) ? data.data.plugins : [];
};

// 📋 Get plugin input spec
export const fetchPluginSpec = async (
  pluginName: string
): Promise<PluginInputField[]> => {
  const response = await axios.get(`/api/v1/plugins/${pluginName}/spec`);
  const data = response.data;

  if (
    import.meta.env.MODE === "development" &&
    !Array.isArray(data?.data?.input_spec)
  ) {
    console.warn("Unexpected plugin spec shape:", data);
  }

  return Array.isArray(data?.data?.input_spec) ? data.data.input_spec : [];
};

// 📜 Fetch plugin execution history
export const fetchPluginHistory = async (): Promise<PluginExecution[]> => {
  const response = await axios.get("/api/v1/plugin/history");
  const data = response.data;

  if (
    import.meta.env.MODE === "development" &&
    !Array.isArray(data?.data)
  ) {
    console.warn("Unexpected history shape:", data);
  }

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

  if (
    import.meta.env.MODE === "development" &&
    !data?.data?.result && !data?.data
  ) {
    console.warn("Unexpected runPlugin result:", data);
  }

  return data?.data?.result ?? data?.data ?? "No result";
};

// 🧪 Format plugin output
export const formatPluginResult = (result: unknown): string => {
  if (typeof result === "object") {
    return JSON.stringify(result, null, 2);
  }
  return String(result);
};

// ✅ Optional re-exports
export type { PluginSpec, PluginInputField, PluginExecution };
