"use strict"
import {combineReducers} from 'redux';

import {articlesReducers} from './articlesReducers';

export default combineReducers({
  articles: articlesReducers
})