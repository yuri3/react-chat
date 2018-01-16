import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';
import { Tabs, Tab } from 'material-ui/Tabs';
import InputIcon from 'material-ui/svg-icons/action/input';
import UserAddIcon from 'material-ui/svg-icons/social/group-add';

import LogInForm from '../components/LogInForm';
import SignUpForm from '../components/SignUpForm';

const tabsStyle = {
  borderTopLeftRadius: '7px',
  borderTopRightRadius: '7px',
};

class LogInOrSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'Log In',
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(tabValue) {
    this.setState({ tabValue });
  }

  render() {
    const {
      location,
      history,
      cookies,
      logInUser,
      validateSignUpFields,
      signUpUser,
      cancel,
      logOutUser,
    } = this.props;
    const { tabValue } = this.state;
    const formProps = {
      location,
      history,
      cookies,
      cancel,
      logOutUser,
    };
    const logInFormProps = {
      ...formProps,
      logInUser,
    };
    const signUpFormProps = {
      ...formProps,
      validateSignUpFields,
      signUpUser,
    };
    return (
      <div>
        <aside>
          <Tabs tabItemContainerStyle={tabsStyle} value={tabValue} onChange={this.handleTabChange}>
            <Tab
              icon={<InputIcon />}
              label="Log In"
              value="Log In"
            >
              {tabValue === 'Log In' && <LogInForm {...logInFormProps} />}
            </Tab>
            <Tab
              icon={<UserAddIcon />}
              label="Sign Up"
              value="Sign Up"
            >
              {tabValue === 'Sign Up' && <SignUpForm {...signUpFormProps} />}
            </Tab>
          </Tabs>
        </aside>
      </div>
    );
  }
}

LogInOrSignUp.propTypes = {
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  logInUser: PropTypes.func.isRequired,
  validateSignUpFields: PropTypes.func.isRequired,
  signUpUser: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  logOutUser: PropTypes.func.isRequired,
};

export default LogInOrSignUp;
