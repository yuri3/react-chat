import React from 'react';
import PropTypes from 'prop-types';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Profile from './components/Profile';
import RequireAuth from './containers/AuthenticationContainer';

export const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

const MainRoutes = () => (
  <Router>
    <Switch>
      <Route render={props => (
        <App path="/" {...props}>
          <div>
            <Route path="/home" component={Home} />
            <Route path="/profile" component={RequireAuth(Profile)} />
          </div>
        </App>
      )} />
    </Switch>
  </Router>
);

export default MainRoutes;
