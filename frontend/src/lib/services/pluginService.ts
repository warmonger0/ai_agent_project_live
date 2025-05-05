import api from "@/lib/services/api";
import { unwrapApiResponse } from "@/lib/utils/apiHelpers";
import type {
  PluginSpec,
  PluginInputField,
  PluginExecution,
} from "@/lib/types/plugin";

// 🔍 List all available plugins
export const fetchPlugins = async (): Promise<PluginSpec[]> => {
  const res = await api.get("/api/v1/plugins/");
  const data = unwrapApiResponse<{ plugins: PluginSpec[] }>(res);
  return data.plugins || [];
};

// 📋 Get plugin input spec
export const fetchPluginSpec = async (
  pluginName: string
): Promise<PluginInputField[]> => {
  const res = await api.get(`/api/v1/plugins/${pluginName}/spec`);
  return unwrapApiResponse<PluginInputField[]>(res);
};

// 📜 Fetch plugin execution history
export const fetchPluginHistory = async (): Promise<PluginExecution[]> => {
  const res = await api.get("/api/v1/plugins/history");
  return unwrapApiResponse<PluginExecution[]>(res);
};

// 🧠 Execute a plugin with dynamic inputs
export const runPlugin = async (
  pluginName: string,
  inputs: Record<string, unknown>
): Promise<unknown> => {
  const res = await api.post(`/api/v1/plugins/run/${pluginName}`, inputs);
  return unwrapApiResponse(res);
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
