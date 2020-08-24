import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Home from './pages/Home';
import Sale from './pages/Sale';

import { UserProvider } from './context/userContext';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/sign-in">
            <UserProvider>
              <SignIn />
            </UserProvider>
          </Route>
          <Route path="/sign-up">
            <UserProvider>
              <SignUp />
            </UserProvider>
          </Route>
          <Route path="/forgot-password">
            <UserProvider>
              <ForgotPassword />
            </UserProvider>
          </Route>
          <Route path="/terms">
            <Terms />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <Route path="/sale">
            <Sale />
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
