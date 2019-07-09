"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {getArticles} from '../../actions/articlesActions';
import {bindActionCreators} from 'redux';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import ArticleItem from './articleItem';
import ArticlesForm from './articlesForm';

class ArticlesList extends React.Component{
  componentDidMount(){
    this.props.getArticles()
  }
  render(){
    const articlesList =this.props.articles.map(function(articlesArr){
      return(
        <Col xs={12} sm={6} md={4}
        key={articlesArr._id}>
          <ArticleItem ID= {articlesArr.ID}
            Title={articlesArr.Title}
          />
        </Col>
      ) 
    })
      return(
        <Grid>
        <Row style={{marginTop:'15px'}}> 
          {articlesList}
        </Row>
      </Grid>
    ) 
  }
}
function mapStateToProps(state){
  return{
  articles: state.articles.articles
  } 
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getArticles: getArticles
  }, dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(ArticlesList);
