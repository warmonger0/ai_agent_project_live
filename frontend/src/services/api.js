import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.50.142:8000',
});

export default api;
