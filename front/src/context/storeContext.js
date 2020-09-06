
import createDataContext from './createDataContext';
import { 
  register,
  authenticate,
  createCategory,
  createProduct,
  updateStoreTax,
  deleteStoreProduct,
  deleteStoreCategory,
  updateStoreProduct,
  updateStoreCategory,
  createStoreOrder,
  consumeProduct,
  deleteStoreOrder,
} from '../services';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  ADD_PRODUCT: 'ADD_PRODUCT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_TAX: 'UPDATE_TAX',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  CREATE_ORDER: 'CREATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
};

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_UP:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_OUT:
        return {};
    case ACTIONS.ADD_PRODUCT:
      return {...state, store: {...state.store, products: [...state.store.products, payload]}};
    case ACTIONS.ADD_CATEGORY:
      return {...state, store: {...state.store, categories: [...state.store.categories, payload]}};
    case ACTIONS.DELETE_PRODUCT:
      return {...state, store: {...state.store, products: state.store.products.filter(product => product._id !== payload)}};
    case ACTIONS.DELETE_CATEGORY:
      return {...state, store: {...state.store, categories: state.store.categories.filter(category => category._id !== payload)}};
    case ACTIONS.UPDATE_TAX:
      return {...state, store: {...state.store, tax: payload}};
    case ACTIONS.UPDATE_PRODUCT:
      const newProducts = state.store.products.map(prod => {
        if (prod._id === payload._id) {
          return payload;
        }
        return prod;
      });
      return {...state, store: {...state.store, products: newProducts}};
    case ACTIONS.UPDATE_CATEGORY:
      const newCategories = state.store.categories.map(category => {
        if (category._id === payload._id) {
          return payload;
        }
        return category;
      });
      return {...state, store: {...state.store, categories: newCategories}};
    case ACTIONS.CREATE_ORDER:
      return {...state, store: {...state.store, orders: [...state.store.orders, payload]}};
    case ACTIONS.DELETE_ORDER:
      return {...state, store: {...state.store, orders: state.store.orders.filter(order => order._id !== payload)}};
    default:
      return state;
  }
}

const signUp = (dispatch) => {
  return async ({ name, email, password }, callback) => {
    const response = await register(name, email, password);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_UP, payload: response.data});
      // save jtw token to local storage
      localStorage.setItem('EXPRESS-POS/token', response.data.token);
    }
    if (callback) {
      callback(response);
    }
  };
}

const signIn = (dispatch) => {
  return async ({ email, password }, success, fail) => {
    const response = await authenticate(email, password);
    if (!response) {
      // if no response found then do nothing
      return;
    }
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_IN, payload: response.data});
      // save jtw token to local storage
      localStorage.setItem('EXPRESS-POS/token', response.data.token);

      // check if there is a success handler
      if (success) {
        success();
      }
    } else {
      // check if there is a fail handler
      if (fail) {
        fail();
      }
    }
  };
}

const signOut = (dispatch) => {
  return (callback) => {
    localStorage.removeItem('EXPRESS-POS/token');
    dispatch({type: ACTIONS.SIGN_OUT});
    if (callback) {
      callback();
    }
  }
}

const addProduct = (dispatch) => {
  return async (product, callback) => {
    const response = await createProduct(product);
    if (response.status === 201) {
      dispatch({type: ACTIONS.ADD_PRODUCT, payload: product});
    }
    if (callback) {
      callback(response);
    }
  }
}

const deleteProduct = (dispatch) => {
  return async (product) => {
    const response = await deleteStoreProduct(product);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_PRODUCT, payload: product._id});
    }
  }
}

const addCategory = (dispatch) => {
  return async (category, success, fail) => {
    const response = await createCategory(category);
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
  return async (category) => {
    // TODO: check if category is used
    // if category is used then do not delete the category
    const response = await deleteStoreCategory(category);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_CATEGORY, payload: category._id});
    }
  }
}

const updateTax = (dispatch) => {
  return async (tax, callback) => {
    const response = await updateStoreTax(tax);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_TAX, payload: response.data});
      if (callback) {
        callback();
      }
    }
  }
}

const updateProduct = (dispatch) => {
  return async (product, callback) => {
    const response = await updateStoreProduct(product);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: response.data});
      if (callback) {
        callback();
      }
    }
  }
}

const updateCategory = (dispatch) => {
  return async (category, success, fail) => {
    const response = await updateStoreCategory(category);
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

const createOrder = (dispatch) => {
  return async (order, callback) => {
    const response = await createStoreOrder(order);
    if (response.status === 201) {
      dispatch({type: ACTIONS.CREATE_ORDER, payload: response.data});
      
      //update product count according to the amount of each order consumed
      order.products.forEach(async (prod) => {
        const response = await consumeProduct({ _id: prod.product, count: prod.count });
        if (response.status === 200) {
          dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: response.data});
        }
      });

      if (callback) {
        callback(response.data._id);
      }
    }
  }
}

const deleteOrder = (dispatch) => {
  return async (order, callback) => {
    const response = await deleteStoreOrder(order);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_ORDER, payload: order._id});
    }
    if (callback) {
      callback();
    }
  }
}

export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
    signOut,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateTax,
    updateProduct,
    updateCategory,
    createOrder,
    deleteOrder,
  },
  {}
);
