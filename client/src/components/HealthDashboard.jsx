import React from 'react';
import { withRouter } from "react-router-dom";
import CompletedArticles from './CompletedArticles.jsx';
import Sidebar from './Sidebar.jsx';

class HealthDashboard extends React.Component {

  state = {
    userId: null,
    divHeight: ''
  }

  componentDidMount() {
    this.setState({
      userId: this.props.getUserInfo.data.userInfo.userId,
      divHeight: window.innerHeight - 100 + 'px'
    })
  }

  render() {
    return (
      <div id='health-dashboard' style={{height: this.state.divHeight}}>
        <Sidebar location={this.props.location} getUserInfo={this.props.getUserInfo}/>
        <div id='health-dashboard-inner-content'>
          <CompletedArticles />
        </div>
      </div>
    );
  }
}

export default withRouter(HealthDashboard);