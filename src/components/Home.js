import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    console.log('props', this.props);
    return (
      <div style={{ border: '1px solid black' }}>
        <h3>You must Log in to view the page at {from.pathname}</h3>
        <button><Link to="/auth">Log In</Link></button>
      </div>
    );
  }
}

Home.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({}),
  }).isRequired,
};

export default Home;
