import instance from './index';

export const register = async (name, email, fname, lname, password, phone) => {
  try {
    return await instance.post('/api/user/create', { name, email, fname, lname, password, phone });
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

export const getStaffAsync = async () => {
  try {
    return await instance.get('/api/user');
  } catch (error) {
    return error.response;
  }
}

export const addStaffAsync = async (staff) => {
  try {
    return await instance.post('/api/user/staff', { ...staff });
  } catch (error) {
    return error.response;
  }
}
