
import createDataContext from './createDataContext';
import {
  createOrderAsync,
  deleteOrderAsync,
  getOrderAsync,
} from '../services/orderService';

const ACTIONS = {
  LOAD_ORDER: 'LOAD_ORDER',
  CREATE_ORDER: 'CREATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
};

const orderReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.LOAD_ORDER:
      return payload;
    case ACTIONS.CREATE_ORDER:
      return [...state, payload]
    case ACTIONS.DELETE_ORDER:
      return state.filter(order => order._id !== payload)
    default:
      return state;
  }
}

const loadOrder = (dispatch) => {
  return async (startDate, endDate, success, fail) => {
    debugger;
    const response = await getOrderAsync(null, startDate, endDate);
    if (response.status === 200) {
      dispatch({type: ACTIONS.LOAD_ORDER, payload: response.data});
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
  return async (order, success, fail) => {
    const response = await createOrderAsync(order);
    if (response.status === 201) {
      dispatch({type: ACTIONS.CREATE_ORDER, payload: response.data});
      if (success) {
        success(response.data._id);
      }
    } else {
      if (fail) {
        fail();
      }
    }
  }
}

const deleteOrder = (dispatch) => {
  return async (order, success, fail) => {
    const response = await deleteOrderAsync(order);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_ORDER, payload: order._id});
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

const socketAddOrder = (dispatch) => {
  return async (oid) => {
    const response = await getOrderAsync(oid);
    if (response.status === 200) {
      dispatch({ type: ACTIONS.CREATE_ORDER, payload: response.data });
    }
  }
}

const socketDeleteOrder = (dispatch) => {
  return (oid) => {
    dispatch({ type: ACTIONS.DELETE_ORDER, payload: oid });
  }
}

export const { Context, Provider } = createDataContext(
  orderReducer,
  {
    loadOrder,
    createOrder,
    deleteOrder,
    socketAddOrder,
    socketDeleteOrder,
  },
  [],
  'orderState'
);
