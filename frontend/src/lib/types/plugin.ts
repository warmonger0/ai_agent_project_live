export type PluginStatus = "success" | "error" | "pending" | "skipped";

export interface PluginExecution {
  id: number;
  plugin_name: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  status: PluginStatus;
  timestamp: string;
}

export interface PluginSpec {
  name: string;
  description?: string;
  module?: string;
  class?: string;
}

export interface PluginInputField {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}
