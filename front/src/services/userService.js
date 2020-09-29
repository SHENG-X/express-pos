import instance from './index';

export const register = async (name, email, fname, lname, password, phone) => {
  try {
    return await instance.post('/api/user/create', {
      name, email, fname, lname, password, phone,
    });
  } catch (error) {
    return error.response;
  }
};

export const authenticate = async (email, password) => {
  try {
    return await instance.post('/api/user', { email, password });
  } catch (error) {
    return error.response;
  }
};

export const getStaffAsync = async (uid) => {
  try {
    return await instance.get('/api/user', { params: { uid } });
  } catch (error) {
    return error.response;
  }
};

export const addStaffAsync = async (staff) => {
  try {
    return await instance.post('/api/user/staff', { ...staff });
  } catch (error) {
    return error.response;
  }
};

export const updateStaffAsync = async (staff) => {
  try {
    return await instance.put('/api/user/staff', { ...staff });
  } catch (error) {
    return error.response;
  }
};

export const deleteStaffAsync = async (staffId) => {
  try {
    return await instance.delete('/api/user/staff', { params: { staffId } });
  } catch (error) {
    return error.response;
  }
};
