
import createDataContext from './createDataContext';
import { register, authenticate } from '../services';

const mockCategories = [
  {
    _id: '7850273978401739',
    name: 'Nike',
    prodCount: 100
  },
  {
    _id: '7481937590759372',
    name: 'Adidas',
    prodCount: 50
  }
];
const mockProducts = [ 
  {
    _id: '2314124124131232214',
    name: 'Chai Tea Latte',
    count: 100,
    enable: true,
    prices: [
      {name: 'Retail', value: 12.45},
      {name: 'Bundle', value: 10.31},
      {name: 'WholeSale', value: 8.24}
    ],
    cost: 6.54
  },
  {
    _id: '2314123412413654121',
    name: 'Milk Latte',
    count: 87,
    enable: true,
    prices: [
      {name: 'Retail', value: 8.24},
      {name: 'Bundle', value: 7.85},
      {name: 'WholeSale', value: 6.24}
    ],
    cost: 4.78
  },
  {
    _id: '2986753412413654121',
    name: 'Dark Roast',
    count: 59,
    enable: true,
    prices: [
      {name: 'Retail', value: 4.45},
      {name: 'Bundle', value: 3.98},
      {name: 'WholeSale', value: 3.56}
    ],
    cost: 2.89
  },
];

const initialState = {
  tax: {
    enable: true,
    rate: 0.12,
  },
  products: mockProducts,
  categories: mockCategories
};

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  ADD_PRODUCT: 'ADD_PRODUCT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_TAX: 'UPDATE_TAX',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT'
};

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return payload;
    case ACTIONS.SIGN_UP:
      break;
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
      return state.products.map(prod => {
        if (prod._id === payload._id) {
          return payload;
        }
        return prod;
      });
    default:
      return state;
  }
}

const signUp = (dispatch) => {
  return async ({ name, email, password }, callback) => {
    const response = await register(name, email, password);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_UP, payload: response.data});
    }
    if (callback) {
      callback(response);
    }
  };
}

const signIn = (dispatch) => {
  return async ({ email, password }, callback) => {
    const response = await authenticate(email, password);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_IN, payload: response.data});
    }
    if (callback) {
      callback(response);
    }
  };
}

const addProduct = (dispatch) => {
  return (product) => {
    // TODO: save product to server side
    // on success add the product response
    product = {...product, _id: `${Math.round(Math.random() * 10000000000)}`};
    dispatch({type: ACTIONS.ADD_PRODUCT, payload: product});
  }
}

const deleteProduct = (dispatch) => {
  return (pid) => {
    dispatch({type: ACTIONS.DELETE_PRODUCT, payload: pid});
  }
}

const addCategory = (dispatch) => {
  return (category) => {
    category = {...category, _id: `${Math.round(Math.random() * 10000000000)}`};
    dispatch({type: ACTIONS.ADD_CATEGORY, payload: category});
  }
}

const deleteCategory = (dispatch) => {
  return (pid) => {
    dispatch({type: ACTIONS.DELETE_CATEGORY, payload: pid});
  }
}

const updateTax = (dispatch) => {
  return (tax) => {
    dispatch({type: ACTIONS.UPDATE_TAX, payload: tax});
  }
}

const updateProduct = (dispatch) => {
  return (product) => {
    dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: product});
  }
}

export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateTax,
    updateProduct
  },
  initialState
);
