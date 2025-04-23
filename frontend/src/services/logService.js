import api from './api';

export const fetchDeploymentLogs = async () => {
  const response = await api.get('/logs');
  return response.data;
};
