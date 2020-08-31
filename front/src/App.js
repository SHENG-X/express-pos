import React, {
  useContext,
  useEffect,
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
import Dashboard from './pages/Dashboard';
import { Context } from './context/storeContext';

const App = () => {
  const { state, tokenAuth } = useContext(Context);

  useEffect(() => {
    tokenAuth();
  });

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
