import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  HashRouter,
} from "react-router-dom";

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


const App = () => {
  const { userState, signIn } = useContext(UserContext);
  const { loadStore } = useContext(StoreContext);

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
          }
        )
      },
      () => { setFetchToken(true); }
    );
  }, []);

  if (localStorage.getItem('EXPRESS-POS/token') 
      && (window.location.href.includes('sale') 
        || window.location.href.includes('dashboard'))) {
    if (!fetchToken) {
      return (
        <Loading/>
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
            userState.authenticated ?
          <Sale />
          :
          <Redirect to="/" />
          }
        </Route>
        <Route path="/dashboard">
        {
            userState.authenticated ?
            <Dashboard />
          :
          <Redirect to="/" />
        }
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
