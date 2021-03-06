
import createDataContext from './createDataContext';
import {
  loadStoreAsync,
  createCategoryAsync,
  createProductAsync,
  updateTaxAsync,
  deleteProductAsync,
  deleteCategoryAsync,
  updateProductAsync,
  updateCategoryAsync,
  restockProductAsync,
  getCategoryAsync,
  getProductAsync,
  getTaxAsync,
} from '../services/storeService';

const ACTIONS = {
  LOAD_STORE: 'LOAD_STORE',
  ADD_PRODUCT: 'ADD_PRODUCT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_TAX: 'UPDATE_TAX',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
};

const storeReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.LOAD_STORE:
      return { ...payload };
    case ACTIONS.ADD_PRODUCT:
      return {...state, products: [...state.products, payload]};
    case ACTIONS.ADD_CATEGORY:
      return {...state, categories: [...state.categories, payload]};
    case ACTIONS.DELETE_PRODUCT:
      return {...state, products: state.products.filter(product => product._id !== payload)};
    case ACTIONS.DELETE_CATEGORY:
      return {...state, categories: state.categories.filter(category => category._id !== payload)};
    case ACTIONS.UPDATE_TAX:
      return {...state, tax: payload};
    case ACTIONS.UPDATE_PRODUCT:
      const newProducts = state.products.map(prod => {
        if (prod._id === payload._id) {
          return { ...payload, key: Date.now() };
        }
        return prod;
      });
      return {...state, products: newProducts};
    case ACTIONS.UPDATE_CATEGORY:
      const newCategories = state.categories.map(category => {
        if (category._id === payload._id) {
          return { ...payload, key: Date.now()};
        }
        return category;
      });
      return {...state, categories: newCategories};
    default:
      return state;
  }
}

const loadStore = (dispatch) => {
  return async (success, fail) => {
    const response = await loadStoreAsync();
    if (response.status === 200) {
      dispatch({type: ACTIONS.LOAD_STORE, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const createProduct = (dispatch) => {
  return async (product, success, fail) => {
    const response = await createProductAsync(product);
    if (response.status === 201) {
      dispatch({type: ACTIONS.ADD_PRODUCT, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const deleteProduct = (dispatch) => {
  return async (product, success, fail) => {
    const response = await deleteProductAsync(product);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_PRODUCT, payload: product._id});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const createCategory = (dispatch) => {
  return async (category, success, fail) => {
    const response = await createCategoryAsync(category);
    if (response.status === 201) {
      dispatch({type: ACTIONS.ADD_CATEGORY, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const deleteCategory = (dispatch) => {
  return async (category, success, fail) => {
    // TODO: check if category is used
    // if category is used then do not delete the category
    const response = await deleteCategoryAsync(category);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_CATEGORY, payload: category._id});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const updateTax = (dispatch) => {
  return async (tax, success, fail) => {
    const response = await updateTaxAsync(tax);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_TAX, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const updateProduct = (dispatch) => {
  return async (product, success, fail) => {
    const response = await updateProductAsync(product);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  } 
}

const updateCategory = (dispatch) => {
  return async (category, success, fail) => {
    const response = await updateCategoryAsync(category);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_CATEGORY, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const restockProduct = (dispatch) => {
  return async (product, success, fail) => {
    const response = await restockProductAsync(product);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: response.data});
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const socketGetCategoryUtil = async (dispatch, cid, type) => {
    const response = await getCategoryAsync(cid);
    if (response.status === 200) {
      dispatch({ type, payload: response.data });
    }
}

const socketGetCategory = (dispatch) => {
  return async (cid) => {
    await socketGetCategoryUtil(dispatch, cid, ACTIONS.ADD_CATEGORY);
  }
}

const socketUpdateCategory = (dispatch) => {
  return async (cid) => {
    await socketGetCategoryUtil(dispatch, cid, ACTIONS.UPDATE_CATEGORY);
  }
}

const socketDeleteCategory = (dispatch) => {
  return (cid) => {
    dispatch({type: ACTIONS.DELETE_CATEGORY, payload: cid});
  }
}

const socketGetProductUtil = async (dispatch, pid, type) => {
  const response = await getProductAsync(pid);
    if (response.status === 200) {
      dispatch({ type, payload: response.data });
    }
}

const socketAddProduct = (dispatch) => {
  return async (pid) => {
    await socketGetProductUtil(dispatch, pid, ACTIONS.ADD_PRODUCT);
  }
}

const socketUpdateProduct = (dispatch) => {
  return async (pid) => {
    await socketGetProductUtil(dispatch, pid, ACTIONS.UPDATE_PRODUCT);
  }
}

const socketDeleteProduct = (dispatch) => {
  return (pid) => {
    dispatch({type: ACTIONS.DELETE_PRODUCT, payload: pid});
  }
}

const socketUpdateTax = (dispatch) => {
  return async () => {
    const response = await getTaxAsync();
    if (response.status === 200) {
      dispatch({ type: ACTIONS.UPDATE_TAX, payload: response.data });
    }
  }
}

export const { Context, Provider } = createDataContext(
  storeReducer,
  {
    loadStore,
    createProduct,
    deleteProduct,
    createCategory,
    deleteCategory,
    updateTax,
    updateProduct,
    updateCategory,
    restockProduct,
    socketGetCategory,
    socketUpdateCategory,
    socketDeleteCategory,
    socketAddProduct,
    socketUpdateProduct,
    socketDeleteProduct,
    socketUpdateTax,
  },
  {},
  'storeState'
);
