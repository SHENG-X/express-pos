
import createDataContext from './createDataContext';
import { 
  register,
  authenticate,
} from '../services/userService';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
};

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_UP:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_OUT:
        return { authenticated: false };
    default:
      return state;
  }
}

const signUp = (dispatch) => {
  return async ({ name, email, fname, lname, password }, success, fail) => {
    const response = await register(name, email, fname, lname, password);
    if (response.status === 201) {
      dispatch({type: ACTIONS.SIGN_UP, payload: response.data});
      // save jtw token to local storage
      localStorage.setItem('EXPRESS-POS/token', response.data.token);
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail();
      }
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

export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
    signOut,
  },
  { authenticate: false },
  'userState'
);
