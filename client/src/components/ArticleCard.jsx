import React from 'react';
import Popover from 'react-bootstrap/lib/Popover';
import Panel from 'react-bootstrap/lib/Panel';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Voter from './Voter.jsx';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Badge from 'react-bootstrap/lib/Badge';

import ArticleModal from './ArticleModal.jsx';

import { DELETE_ARTICLE } from '../apollo/resolvers';
import { GET_ARTICLES_FROM_SERVER, GET_ONE_FULL_ARTICLE } from '../apollo/serverQueries';
import { Mutation, ApolloConsumer } from "react-apollo";

const updateCache = (cache, { data: { deleteArticle} }) => {
  console.log('cache', cache, deleteArticle);
  const { articles } = cache.readQuery({ query: GET_ARTICLES_FROM_SERVER });

  cache.writeQuery({
    query: GET_ARTICLES_FROM_SERVER,
    data: {
      articles: articles.filter(article => article._id !== deleteArticle._id)
    }
  });
};

class ArticleCard extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: false,
      fullArticle: {},
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);


  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
  
    return (
      <Mutation mutation={DELETE_ARTICLE} update={updateCache}>
        { (deleteArticle) => {
          return (
            <div className="article">
              <Panel bsStyle="success">
                  <Panel.Heading className='title'>
                    <button class='delete-article-button' onClick={() => deleteArticle({ variables: { _id: this.props.article._id } })}> X </button>
                    <Panel.Title>{this.props.article.title}</Panel.Title>
                    <Badge pullRight bsStyle="danger">{this.props.article.articleStance}</Badge>
                  </Panel.Heading>
                  <Panel.Body className='subtitle'>{this.props.article.description}</Panel.Body>

                  {/* Wrap this button in apollo consumer, the load the entire article into state.  Then pass the whole article down as a prop. */}
                  <ApolloConsumer>
                    { () => (
                      <Button 
                        className="eat-me" 
                        bsStyle="info" 
                        bsSize="large" 
                        onClick={async () => {
                          const {data} = await client.query({
                            query: GET_ONE_FULL_ARTICLE,
                            variables: {_id: this.props.article._id}
                          })
                          this.setState({
                            fullArticle: data.article,
                          })
                          {this.handleShow}
                        }}
                      >
                      Eat me
                    </Button>
                    )}
                  </ApolloConsumer>


              </Panel>
              <ArticleModal 
                show={this.state.show} 
                handleClose = {this.handleClose}
                handleSHow = {this.handleShow}
                article = {this.state.fullArticle}
              />
            </div>
          )}}
      </Mutation>
    );
  }
}

export default ArticleCard;