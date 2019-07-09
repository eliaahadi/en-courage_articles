"use strict"
import React from 'react';
import {MenuItem, ListGroup, InputGroup, DropdownButton, Image, Col, Row, Well, Panel, FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import {postArticle, updateArticle, getArticle, deleteArticle, getArticles, resetButtonAdd, resetButtonUpdate} from '../../actions/articlesActions';
import axios from 'axios';

class ArticlesForm extends React.Component{
  constructor() {
    super();
    this.state = {
      articles:[{}],
      article:'',
      showValues: {},
      isFetching: true
    }
  }
   
  componentDidMount(){
    this.setState({...this.state, isFetching: true});
      this.props.getArticles();
     this.setState({...this.state, isFetching: false});
    //GET ARTICLES FROM API
     axios.get('/api/articles')
    .then(function(response){
      this.setState({articles:response.data});
    }.bind(this))
    .catch(function(err){
      this.setState({articles:'error loading articles files from the server', article:''})
    }.bind(this))
  }
  addArticleSubmit(){
    const article =
    [
      {
        Title: findDOMNode(this.refs.Title).value,
      }
    ]
    if (article[0].Title === "") {
      alert('Article Title must not be empty to save it')
    } else {
      this.props.postArticle(article[0]);
    }
    // console.log("post articles ", article, article[0].Title)
    console.log("post article DOM node ->",findDOMNode(this.refs.Title).value)
  }

  updateArticleSubmit(){
    const article =
    [
      {
        Title: findDOMNode(this.refs.updateTitle).value,
      }
    ]
    if (article[0].Title === "") {
      alert('Article Title must not be empty to save it')
    } else {
      this.props.updateArticle(article, this.state.showValues.ID);
    }
    console.log("UPDATE article DOM node ->",article, article[0], article[0].Title, this.state.showValues.ID, findDOMNode(this.refs.updateTitle).value)
  }

  onDelete(){
    let articleId =
    findDOMNode(this.refs.delete).value;
    if (articleId === 'select') {
      alert('choose an ID to delete');
    } else {
      this.props.deleteArticle(articleId);
    }
  }
  handleSelect(article){
    this.setState({
      article: article.ID
    })
    this.setState({showValues: article});
  }

  resetFormAdd(){
    //RESET THE ADD Button
    this.props.resetButtonAdd();
    findDOMNode(this.refs.Title).value = '';
    this.setState({article:''});
  }

  resetFormUpdate(){
    //RESET THE UPDATE Button
    this.props.resetButtonUpdate();
    findDOMNode(this.refs.updateTitle).value = '';
    this.setState({article:''});
  }

  render(){
    if (this.state.isFetching) {
      return <p>Loading ...</p>;
    }
    const articlesListDelete = this.props.articles.map(function(articlesArr){
      return (
        <option key={articlesArr.ID}>
        {articlesArr.ID} </option>
      )
    })

    const articlesListSelect = this.props.articles.map(function(articleArr){
      return (
       <li key={articleArr.ID}>
        id:{articleArr.ID} - title: {articleArr.Title}
       </li> 
        )
      }, this)

    const articlesList =
    this.state.articles.map(function(articleArr){
      return(
        <MenuItem key={articleArr.ID}
        eventKey={articleArr.Title}
        onClick={this.handleSelect.bind(this,
        articleArr)}>
          ID:{articleArr.ID} - Title:{articleArr.Title}
        </MenuItem>
        )
      }, this)

    return(
      <div>
      <Well>
        <Row>
          <Panel>
            <h3>
              Articles List
            </h3>
            {articlesListSelect}
          </Panel>
        </Row>
      <Row>
       <Col xs={12} sm={6}>
        <Panel>
          <InputGroup>
            <FormControl id={this.state.article} type="text"
              ref="article" value={this.state.article} />
              <DropdownButton 
                componentClass={InputGroup.Button}
                id="input-dropdown-addon"
                title="Select an article"
                bsStyle="primary">
                {articlesList}
              </DropdownButton>
          </InputGroup>

          <FormGroup controlId="updateTitle" validationState={this.props.validation}>
            <ControlLabel>Update Article</ControlLabel>
            <FormControl
            type="text"
            placeholder={this.state.showValues.Title}
            ref="updateTitle" />
            <FormControl.Feedback />
          </FormGroup>
        <Button
          onClick={(!this.props.updatemsg)?(this.updateArticleSubmit.bind(this)):(this.resetFormUpdate.bind(this))}
          bsStyle={(!this.props.style)?("primary"):(this.props.style)}>
          {(!this.props.updatemsg)?("Update title"):(this.props.updatemsg)}
        </Button>
        </Panel>
      </Col>
      <Col xs={12} sm={6}>
        <Panel>
          <FormGroup controlId="Title" validationState={this.props.validation}>
            <ControlLabel>Add Article</ControlLabel>
            <FormControl
            type="text"
            placeholder="Enter Title"
            ref="Title" />
            <FormControl.Feedback/>
          </FormGroup>
        <Button
          onClick={(!this.props.msg)?(this.addArticleSubmit.bind(this)):(this.resetFormAdd.bind(this))}
          bsStyle={(!this.props.style)?("primary"):(this.props.style)}>
          {(!this.props.msg)?("Save title"):(this.props.msg)}
        </Button>
        </Panel>
        <Panel>
          <FormGroup
            controlId="formControlsSelect">
            <ControlLabel>Select a title id to delete</ControlLabel>
            <FormControl ref="delete"
              componentClass="select" placeholder="select">
            <option
            value="select">select</option>
            {articlesListDelete}
            </FormControl>
          </FormGroup>
          <Button
          onClick={this.onDelete.bind(this)}
          bsStyle="danger">Delete title</Button>
        </Panel>
      </Col>
    </Row>
    </Well>
    </div>
    )
  } 
}
function mapStateToProps(state){
  return {
    articles: state.articles.articles,
    msg: state.articles.msg,
    updatemsg: state.articles.updatemsg,
    style: state.articles.style,
    validation: state.articles.validation
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    postArticle, updateArticle, deleteArticle, getArticle, getArticles, resetButtonAdd, resetButtonUpdate
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesForm);