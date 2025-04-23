import api from './api';

export const fetchTasks = async () => {
  const response = await api.get('/status/all');
  return response.data;
};
