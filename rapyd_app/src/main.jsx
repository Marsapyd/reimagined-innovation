import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from './store/reducers/auth';
import App from './App';

const store = configureStore({ reducer: { auth: authReducer } });

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);
ReactDOM.createRoot(document.getElementById('root')).render(app);
