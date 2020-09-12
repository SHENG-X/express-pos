import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Set the AUTH token for any request
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('EXPRESS-POS/token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

export default instance;
