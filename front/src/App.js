import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Switch,
  Route,
  Redirect,
  HashRouter,
} from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Home from './pages/Home';
import Sale from './pages/Sale';
import Loading from './pages/Loading';
import Dashboard from './pages/Dashboard';
import { Context as StoreContext } from './context/storeContext';
import { Context as UserContext } from './context/userContext';
import { Context as OrderContext } from './context/orderContext';

const host = 'http://localhost:3000';

const App = () => {
  const {
    userState,
    signIn,
    socketAddStaff,
    socketUpdateStaff,
    socketDeleteStaff,
  } = useContext(UserContext);

  const {
    storeState,
    loadStore,
    socketGetCategory,
    socketUpdateCategory,
    socketDeleteCategory,
    socketAddProduct,
    socketUpdateProduct,
    socketDeleteProduct,
    socketUpdateTax,
  } = useContext(StoreContext);

  const {
    socketAddOrder,
    socketDeleteOrder,
  } = useContext(OrderContext);

  const [fetchToken, setFetchToken] = useState(false);

  useEffect(() => {
    signIn(
      { email: null, password: null },
      () => {
        loadStore(
          () => {
            setFetchToken(true);
          },
          () => {
            setFetchToken(true);
          },
        );
      },
      () => { setFetchToken(true); },
    );
  }, []);

  useEffect(() => {
    const socket = socketIOClient(host);
    if (fetchToken) {
      socket.on(storeState._id, (data) => {
        if (data.uid === userState._id && data.type !== 'ALTER_PRODUCT') {
          // if the operation is the same user, we know
          // there is response data then do nothing
          return;
        }
        switch (data.type) {
          case 'ADD_CATEGORY':
            socketGetCategory(data.payload);
            break;
          case 'UPDATE_CATEGORY':
            socketUpdateCategory(data.payload);
            break;
          case 'DELETE_CATEGORY':
            socketDeleteCategory(data.payload);
            break;
          case 'ADD_PRODUCT':
            socketAddProduct(data.payload);
            break;
          case 'ALTER_PRODUCT':
          case 'UPDATE_PRODUCT':
            socketUpdateProduct(data.payload);
            break;
          case 'DELETE_PRODUCT':
            socketDeleteProduct(data.payload);
            break;
          case 'UPDATE_TAX':
            socketUpdateTax();
            break;
          case 'ADD_STAFF':
            socketAddStaff(data.payload);
            break;
          case 'UPDATE_STAFF':
            socketUpdateStaff(data.payload);
            break;
          case 'DELETE_STAFF':
            socketDeleteStaff(data.payload);
            break;
          case 'ADD_ORDER':
            socketAddOrder(data.payload);
            break;
          case 'DELETE_ORDER':
            socketDeleteOrder(data.payload);
            break;
          default:
            break;
        }
      });
    }
  }, [fetchToken]);

  if (localStorage.getItem('EXPRESS-POS/token')
      && (window.location.href.includes('sale')
        || window.location.href.includes('dashboard'))) {
    if (!fetchToken) {
      return (
        <Loading />
      );
    }
  }

  return (
    <HashRouter>
      <Switch>
        <Route path="/sign-in">
          <SignIn />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
        <Route path="/privacy">
          <Privacy />
        </Route>
        <Route path="/sale">
          {
            userState.authenticated ? (
              <Sale />
            ) : (
              <Redirect to="/" />
            )
          }
        </Route>
        <Route path="/dashboard">
          {
            userState.authenticated ? (
              <Dashboard />
            ) : (
              <Redirect to="/" />
            )
          }
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
