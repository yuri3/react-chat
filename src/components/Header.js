import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isAuthenticated, logIn, logOut }) => (
  <div>
    <header>
      <h3><Link to="/home">Home</Link></h3>
      <h3><Link to="/profile">Profile</Link></h3>
      <h3>
        {isAuthenticated ?
          <Link to="/home" onClick={logOut}>Log out</Link> :
          <a href="" onClick={logIn}>Log in</a>
        }
      </h3>
    </header>
  </div>
);

export default Header;
