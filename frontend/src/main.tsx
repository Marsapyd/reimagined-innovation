import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { compose, applyMiddleware, combineReducers } from "redux";
import {configureStore} from '@reduxjs/toolkit'
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import authReducer from "./store/reducers/auth";

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer
});

const store = configureStore(rootReducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);
ReactDOM.createRoot(document.getElementById('root')!).render(app)
