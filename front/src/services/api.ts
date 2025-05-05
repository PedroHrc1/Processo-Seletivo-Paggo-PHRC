import axios from 'axios';

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
console.log('[API] baseURL =', base);
const api = axios.create({ baseURL: base });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

export default api;
