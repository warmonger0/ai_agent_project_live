// /home/war/ai_agent_project/frontend/src/lib/services/healthService.ts

import api from "./api";

export const fetchHealthStatus = async () => {
  try {
    const response = await api.get("/api/v1/health");
    return response.data;
  } catch (error) {
    console.error("Error fetching system health:", error);
    throw error;
  }
};
