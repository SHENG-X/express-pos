import instance from './index';

export const register = async (name, email, fname, lname, password) => {
  try {
    return await instance.post('/api/user/create', { name, email, fname, lname, password });
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
