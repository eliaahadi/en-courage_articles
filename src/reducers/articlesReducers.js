"use strict"
// ARTICLES REDUCERS
export function articlesReducers(state={
  articles:[]
}, action) {
  switch(action.type) {
    case "GET_ARTICLES": {
      return {...state, articles:[...action.payload]}
      break;
    }
    case "POST_ARTICLE": {
      return {...state, articles: [...state.articles, ...action.payload], 
        msg:'Saved! Click to continue', style:'success', validation:'success'}
      break;
    }
    case "POST_ARTICLE_REJECTED": {
      return {...state, msg:'Please, try again', style:'danger', validation:'error'}
      break;
    }
    case "RESET_ADD_BUTTON": {
      return {...state, msg:null, style:'primary', validation:null}
      break;
    }
    case "RESET_UPDATE_BUTTON": {
      return {...state, updatemsg:null, style:'primary', validation:null}
      break;
    }
    case "DELETE_ARTICLE": {
      // create a copy of current array of articles
      const currentArticleToDelete = [...state.articles];
      // find which index in articles array to delete
      const indexToDelete = currentArticleToDelete.findIndex(
        function(article) {
          return article.ID == action.payload;
        }
      )
      // use slice to remove article at specified index
      return {articles: [...currentArticleToDelete.slice(0, indexToDelete),
      ...currentArticleToDelete.slice(indexToDelete + 1)]}
      break;
    }
    case "UPDATE_ARTICLE": {
      // create a copy of current array of articles
      const currentArticleToUpdate = [...state.articles];
      // find which index in articles array to update
      const indexToUpdate = currentArticleToUpdate.findIndex(
        function(article) {
          return article.ID = action.payload.ID;
        }
      )
      const newArticleToUpdate = {
        ...currentArticleToUpdate[indexToUpdate],
        Title: action.payload.Title
      }
      // use slice to remove article at specified index
      return {articles: [...currentArticleToUpdate.slice(0, indexToUpdate), newArticleToUpdate,
      ...currentArticleToUpdate.slice(indexToUpdate + 1)],
      updatemsg:'Updated! Click to continue', style:'success', validation:'success'
    }
      break;      
    }
  }
  return state;
}