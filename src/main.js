"use strict"
import React from 'react';
import Menu from './components/menu';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getArticles} from '../src/actions/articlesActions';

class Main extends React.Component{
  componentDidMount(){
    this.props.getArticles();
  }
  render(){
    return(
      <div>
        <Menu />
          {this.props.children}
      </div>
    ); 
  }
}

function mapStateToProps(state){
  return {
  }
}

function mapDispatchToProps(dispatch){
 return bindActionCreators({
  getArticles:getArticles
 }, dispatch)
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Main);