import instance from './index';

export const getOrderAsync = async (oid, startDate, endDate) => {
  try {
    return await instance.get('/api/order', { params: { oid, startDate, endDate } });
  } catch (error) {
    return error.response;
  }
};

export const createOrderAsync = async (order) => {
  try {
    return await instance.post('/api/order', { ...order });
  } catch (error) {
    return error.response;
  }
};

export const deleteOrderAsync = async (order) => {
  try {
    return await instance.delete('/api/order', { params: { ...order } });
  } catch (error) {
    return error.response;
  }
};
