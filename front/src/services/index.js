import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Set the AUTH token for any request
instance.interceptors.request.use((config) => {
  const configInner = config;
  const token = localStorage.getItem('EXPRESS-POS/token');
  configInner.headers.Authorization = token ? `Bearer ${token}` : '';
  return configInner;
});

export default instance;
