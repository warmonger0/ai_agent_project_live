import api from "./api"; // Use shared Axios instance with baseURL

// ✅ Fetch all tasks from the correct backend route
export const fetchTasks = async () => {
  const response = await api.get("/api/v1/tasks"); // ✅ FIXED endpoint
  return response; // Let the caller handle .data
};

// ✅ Retry a task by ID
export const retryTask = async (taskId: number) => {
  try {
    const response = await api.post(`/api/v1/retry/${taskId}`);
    return response.data;
  } catch (err) {
    console.error("Error retrying task:", err);
    throw err;
  }
};

// ✅ Create a new task
export const createTask = async (description: string, model_used = "DeepSeek") => {
  try {
    const response = await api.post("/api/v1/task", {
      description,
      model_used,
    });
    return response.data;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};
