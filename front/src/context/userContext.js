
import createDataContext from './createDataContext';
import { register, authenticate } from '../services';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
}

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      break;
    case ACTIONS.SIGN_UP:
      break;
  }
}

const signUp = () => {
  return async ({ name, email, password }) => {
    const response = await register(name, email, password);
    return response;
  };
}

const signIn = () => {
  return async ({ email, password }) => {
    const response = await authenticate(email, password);
    return response;
  };
}

const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
  },
  {}
);

export const UserContext = Context;
export const UserProvider = Provider;
