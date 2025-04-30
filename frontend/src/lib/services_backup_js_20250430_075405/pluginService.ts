import axios from "axios";

export const fetchPlugins = async () => {
  const response = await axios.get("/api/v1/plugins");
  return response.data.plugins ?? response.data;
};

export const fetchPluginHistory = async () => {
  const response = await axios.get("/api/v1/plugin/history");
  return response.data.executions ?? response.data;
};

export const runPlugin = async (pluginName: string, inputText: string) => {
  const response = await axios.post(`/plugins/run/${pluginName}`, {
    input_text: inputText,
  });
  return response.data.result;
};
