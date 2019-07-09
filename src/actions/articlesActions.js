"use strict"
import axios from 'axios';

// GET A ARTICLE
export function getArticle(id){
  return function(dispatch){
    axios.get("/api/articles/" + id)
      .then(function(response){
        dispatch({type:"GET_ARTICLE", payload:id})
      })
      .catch(function(err){
        dispatch({type:"GET_ARTICLE_REJECTED", payload:err})
      })
  }
}

// GET  ARTICLES (READ)
export function getArticles() {
  return function(dispatch){
    axios.get("/api/articles")
    .then(function(response){
      dispatch({type:"GET_ARTICLES", payload:response.data})
    })
    .catch(function(err){
      dispatch({type:"GET_ARTICLES_REJECTED", payload:err})
    })
  }
}

// POST A ARTICLE (CREATE)
export function postArticle(article) {
  console.log("posted article ", article)
  return function (dispatch) {
    axios.post("/api/articles", article)
      .then(function(response){
        console.log("posted article RESPONSE ", article, response)
        dispatch({type: "POST_ARTICLE", payload: response.data})
      })
      .catch(function(err){
        dispatch({type: "POST_ARTICLE_REJECTED", payload: "there was an error while posting a new article"})
      })
  }
}

// DELETE A ARTICLE
export function deleteArticle(id){
  return function(dispatch){
    axios.delete("/api/articles/" + id)
      .then(function(response){
        dispatch({type:"DELETE_ARTICLE", payload:id})
      })
      .catch(function(err){
        dispatch({type:"DELETE_ARTICLE_REJECTED", payload:err})
      })
  }
}

// UPDATE A ARTICLE (UPDATE)
export function updateArticle(article, id) {
  console.log("updated article ", article, id, article[0].Title)
  return function(dispatch){
    axios.put("/api/articles/" + id, article[0])
      .then(function(response){
        console.log("updated article RESPONSE ", article, id, response)
        dispatch({type: "UPDATE_ARTICLE",
        payload: response.data})
      })
      .catch(function(err){
        dispatch({type:"UPDATE_ARTICLE_REJECTED", payload:err})
      })
  }
}

// RESET FORM ADD BUTTON
export function resetButtonAdd(){
  return {
    type:"RESET_ADD_BUTTON"
  }
}

// RESET FORM UPDATE BUTTON
export function resetButtonUpdate(){
  return {
    type:"RESET_UPDATE_BUTTON"
  }
}