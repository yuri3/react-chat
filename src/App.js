import React from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions/user';
import { NoMatch } from './routes';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import LogInOrSignUpContainer from './containers/LogInOrSignUpContainer';

const ROUTES = ['/', '/auth', '/home', '/profile'];

const authStyle = {
  position: 'absolute',
  zIndex: 200,
  top: '25%',
  left: '50%',
  bottom: 'auto',
  width: '300px',
  transform: 'translate(-50%)',
  borderRadius: '7px',
  border: '1px solid gray',
  backgroundColor: 'white',
};

class App extends React.Component {
  componentWillMount() {
    const { cookies, meFromToken } = this.props;
    const token = cookies.get('token');
    if (token) {
      meFromToken(token);
    }
  }
  render() {
    const {
      user: { isAuthenticated, isShowAuthForm },
      showAuthForm,
      closeAuthForm,
      logInUser,
      validateSignUpFields,
      signUpUser,
      logOutUser,
      location,
      history,
      cookies,
      children,
    } = this.props;

    if (!ROUTES.includes(location.pathname)) {
      return <NoMatch location={location} />;
    }

    let overlay = null;
    if (isShowAuthForm) {
      overlay = {
        visibility: 'visible',
        opacity: 0.5,
      };
    }

    const headerProps = {
      isAuthenticated,
      logIn: (event) => {
        event.preventDefault();
        showAuthForm();
      },
      logOut() {
        logOutUser(cookies);
      },
    };

    const authProps = {
      logInUser,
      validateSignUpFields,
      signUpUser,
      logOutUser,
      cancel: () => {
        closeAuthForm();
      },
      location,
      history,
      cookies,
    };

    return (
      <div>
        <section id="overlay" style={overlay} />
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React-Chat</h2>
          </div>
          <Header {...headerProps} />
        </div>
        {isShowAuthForm &&
          <div style={authStyle}>
            <LogInOrSignUpContainer {...authProps} />
          </div>
        }
        <main>
          {children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.shape({}).isRequired,
  meFromToken: PropTypes.func.isRequired,
  showAuthForm: PropTypes.func.isRequired,
  closeAuthForm: PropTypes.func.isRequired,
  logInUser: PropTypes.func.isRequired,
  validateSignUpFields: PropTypes.func.isRequired,
  signUpUser: PropTypes.func.isRequired,
  logOutUser: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(App));
