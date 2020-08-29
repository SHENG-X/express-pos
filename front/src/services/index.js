import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

export const register = async (name, email, password) => {
  try {
    return await instance.post('/api/user/create', { name, email, password });
  } catch (error) {
    return error.response;
  }
}

export const authenticate = async (email, password) => {
  try {
    return await instance.post('/api/user', { email, password });
  } catch (error) {
    return error.response;
  }
}

export const tokenAuthenticate = async (token) => {
  try {
    return await instance.get('/api/user', { params: { token } });
  } catch (error) {
    return error.response;
  }
}
