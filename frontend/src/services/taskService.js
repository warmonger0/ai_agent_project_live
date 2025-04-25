import axios from 'axios';

// ✅ Fetch all tasks
export const fetchTasks = async () => {
  const response = await axios.get('/status/all'); // Matches FastAPI GET route
  return response.data;
};

// ✅ Retry a task by ID
export const retryTask = async (taskId) => {
  try {
    const response = await axios.post(`/retry/${taskId}`);
    return response.data;
  } catch (err) {
    console.error('Error retrying task:', err);
    throw err;
  }
};

// ✅ Create a new task
export const createTask = async (description, model_used = 'DeepSeek') => {
  try {
    const response = await axios.post('/task', {
      description,
      model_used,
    });

    return response.data;
  } catch (err) {
    console.error('Error creating task:', err);
    throw err;
  }
};
