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

export const createProduct = async (product) => {
  try {
    return await instance.post('/api/product', { ...product });
  } catch (error) {
    return error.response;
  }
}

export const createCategory = async (category) => {
  try {
    return await instance.post('/api/category', { ...category });
  } catch (error) {
    return error.response;
  }
}

export const updateStoreTax = async (tax) => {
  try {
    return await instance.put('/api/tax', { tax });
  } catch (error) {
    return error.response;
  }
}

export const deleteStoreCategory = async (category) => {
  try {
    return await instance.delete('/api/category', { params: { ...category } });
  } catch (error) {
    return error.response;
  }
}

export const deleteStoreProduct = async (product) => {
  try {
    return await instance.delete('/api/product', { params: {...product} });
  } catch (error) {
    return error.response;
  }
}

export const updateStoreProduct = async (product) => {
  try {
    return await instance.put('/api/product', { ...product });
  } catch (error) {
    return error.response;
  }
}

export const updateStoreCategory = async (category) => {
  try {
    return await instance.put('/api/category', { ...category });
  } catch (error) {
    return error.response;
  }
}

export const createStoreOrder = async (order) => {
  try {
    return await instance.post('/api/order', { ...order });
  } catch (error) {
    return error.response;
  }
}

export const consumeProduct = async (product) => {
  try {
    return await instance.put('/api/product/consume', {...product});
  } catch (error) {
    return error.response;
  }
}

export const deleteStoreOrder = async (order) => {
  try {
    return await instance.delete('/api/order', { params: {...order} });
  } catch (error) {
    return error.response;
  }
}

export const restockStoreProduct = async (product) => {
  try {
    return await instance.put('/api/product/restock', {...product});
  } catch (error) {
    return error.response;
  }
}
