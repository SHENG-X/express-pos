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
import { Context } from './context/storeContext';

const App = () => {
  const { state, signIn } = useContext(Context);
  const [fetchToken, setFetchToken] = useState(false);
  
  useEffect(() => {
    signIn(
      { email: null, password: null },
      () => { setFetchToken(true); },
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
    <Router>
      <div>
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
             state.authenticated ?
            <Sale />
            :
            <Redirect to="/" />
           }
          </Route>
          <Route path="/dashboard">
          {
             state.authenticated ?
             <Dashboard />
            :
            <Redirect to="/" />
           }
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
