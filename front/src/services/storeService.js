import instance from './index';

export const createProductAsync = async (product) => {
  try {
    return await instance.post('/api/product', { ...product });
  } catch (error) {
    return error.response;
  }
}

export const createCategoryAsync = async (category) => {
  try {
    return await instance.post('/api/category', { ...category });
  } catch (error) {
    return error.response;
  }
}

export const updateTaxAsync = async (tax) => {
  try {
    return await instance.put('/api/tax', { tax });
  } catch (error) {
    return error.response;
  }
}

export const deleteCategoryAsync = async (category) => {
  try {
    return await instance.delete('/api/category', { params: { ...category } });
  } catch (error) {
    return error.response;
  }
}

export const deleteProductAsync = async (product) => {
  try {
    return await instance.delete('/api/product', { params: {...product} });
  } catch (error) {
    return error.response;
  }
}

export const updateProductAsync = async (product) => {
  try {
    return await instance.put('/api/product', { ...product });
  } catch (error) {
    return error.response;
  }
}

export const updateCategoryAsync = async (category) => {
  try {
    return await instance.put('/api/category', { ...category });
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

export const restockProductAsync = async (product) => {
  try {
    return await instance.put('/api/product/restock', {...product});
  } catch (error) {
    return error.response;
  }
}

export const loadStoreAsync = async (storeId) => {
  try {
    return await instance.get('/api/store');
  } catch (error) {
    return error.response;
  }
}

export const getCategoryAsync = async (cid) => {
  try {
    return await instance.get('/api/category', { params: { cid } });
  } catch (error) {
    return error.response;
  }
}

export const getProductAsync = async (pid) => {
  try {
    return await instance.get('/api/product', { params: { pid } });
  } catch (error) {
    return error.response;
  }
}

export const getTaxAsync = async () => {
  try {
    return await instance.get('/api/tax');
  } catch (error) {
    return error.response;
  }
}
