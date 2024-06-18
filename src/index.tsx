import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import store from './store/store';
import { rrfProps } from './store/store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <App />
        </ReactReduxFirebaseProvider>
      </React.StrictMode>
    </Provider>
  </BrowserRouter>
)

