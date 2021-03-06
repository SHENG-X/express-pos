import React from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';

import './index.css';
import './scss/app.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './i18n';
import { Provider as StoreProvider } from './context/storeContext';
import { Provider as UserProvider } from './context/userContext';
import { Provider as OrderProvider } from './context/orderContext';

ReactDOM.render(
  <React.StrictMode>
    <ToastProvider autoDismiss>
      <UserProvider>
        <StoreProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </StoreProvider>
      </UserProvider>
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
