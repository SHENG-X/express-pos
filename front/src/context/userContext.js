
import createDataContext from './createDataContext';
import { 
  register,
  authenticate,
  addStaffAsync,
  getStaffAsync,
  updateStaffAsync,
} from '../services/userService';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  GET_STAFF: 'GET_STAFF',
  ADD_STAFF: 'ADD_STAFF',
  UPDATE_STAFF: 'UPDATE_STAFF',
};

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_UP:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_OUT:
      return { authenticated: false };
    case ACTIONS.GET_STAFF:
      return {...state, staff: payload };
    case ACTIONS.ADD_STAFF:
      return { ...state, staff: [...state.staff, payload] };
    case ACTIONS.UPDATE_STAFF:
      const updatedStaff = state.staff.map(stf => {
        if (stf._id === payload._id) {
          return payload;
        }
        return stf;
      });
      return { ...state, staff: updatedStaff };
    default:
      return state;
  }
}

const signUp = (dispatch) => {
  return async ({ name, email, fname, lname, password, phone }, success, fail) => {
    const response = await register(name, email, fname, lname, password, phone);
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

const getStaff = (dispatch) => {
  return async (success, fail) => {
    const response = await getStaffAsync();
    if (response.status === 200) {
      dispatch({type: ACTIONS.GET_STAFF, payload: [...response.data]});
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

const addStaff = (dispatch) => {
  return async (staff, success, fail) => {
    const response = await addStaffAsync(staff);
    if (response.status === 201) {
      dispatch({type: ACTIONS.ADD_STAFF, payload: response.data});
      if (success) {
        success();
      } else {
        if (fail) {
          fail();
        }
      }
    }
  }
}

const updateStaff = (dispatch) => {
  return async (staff, success, fail) => {
    const response = await updateStaffAsync(staff);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_STAFF, payload: response.data});
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

}
export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
    signOut,
    getStaff,
    addStaff,
    updateStaff,
  },
  { authenticated: false },
  'userState'
);
