"use strict"

// REACT
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// REACT-ROUTER
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// IMPORT REDUCERS
import reducers from './reducers/index';

//STEP 1 create store
const initialState = window.INITIAL_STATE;
const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducers, initialState, middleware);
import routes from './routes';

const Routes = (
  <Provider store={store}>
    {routes}
  </Provider>
)

render(
  Routes, document.getElementById('app')
);
