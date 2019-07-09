"use strict"
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import ArticlesForm from './components/pages/articlesForm';
import Main from './main';

const routes = (
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={ArticlesForm}/>
      </Route>
    </Router> 
);

export default routes;