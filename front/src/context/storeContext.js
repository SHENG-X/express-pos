
import createDataContext from './createDataContext';
import { register, authenticate } from '../services';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
}

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return payload;
    case ACTIONS.SIGN_UP:
      break;
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

export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
  },
  {}
);
