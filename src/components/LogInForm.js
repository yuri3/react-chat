import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Cookies } from 'react-cookie';
import InputIcon from 'material-ui/svg-icons/action/input';
import CancelIcon from 'material-ui/svg-icons/action/highlight-off';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorIcon from 'material-ui/svg-icons/alert/error-outline';
import './Form.css';

import { setSession } from '../utils/auth';

const validate = (values) => {
  const errors = {};
  const requiredFields = ['email', 'password'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required!';
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address!';
  }
  if (values.password && values.password.length < 6) {
    errors.password = 'Password must contain at least six characters in length!';
  }
  return errors;
};

const renderTextField = ({
  type,
  input,
  placeholder,
  meta: { touched, error },
  ...custom
}) => (
  <div>
    <TextField
      type={type}
      hintText={placeholder}
      floatingLabelText={placeholder}
      errorText={touched && error}
      fullWidth={true}
      {...input}
      {...custom}
      onChange={(event) => {
        const value = event.target.value;
        input.onChange(value);
      }}
    />
  </div>
);

class LogInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: false,
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.cancel = this.cancel.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  updateCheck() {
    this.setState(prevState => ({
      isShowPassword: !prevState.isShowPassword,
    }));
  }

  cancel() {
    const { cancel } = this.props;
    cancel();
  }

  logIn(values) {
    const { logInUser, cookies, history, location, logOutUser } = this.props;
    return logInUser(values)
      .then(({ type, user, ...authResult }) => {
        console.log('logIn', location);
        setSession(authResult, cookies, history);
      })
      .catch((error) => {
        logOutUser(cookies);
        throw new SubmissionError({ _error: error });
      });
  }

  render() {
    const {
      error,
      invalid,
      pristine,
      submitting,
      handleSubmit,
    } = this.props;
    const { isShowPassword } = this.state;
    return (
      <div>
        {error &&
          <section id="error-msg">
            <h3><ErrorIcon style={{ width: '48px', height: '48px' }} color="#d50000" /></h3>
            <h3>{error}</h3>
          </section>
        }
        {submitting &&
          <div id="circular-progress">
            <CircularProgress size={60} thickness={7} />
          </div>
        }
        <form style={{ opacity: submitting ? 0.5 : 1 }}>
          <Field
            name="email"
            placeholder="Email"
            autoFocus
            component={renderTextField}
          />
          <Field
            type={!isShowPassword ? 'password' : ''}
            name="password"
            placeholder="Password"
            component={renderTextField}
          />
          <div id="checkbox">
            <Checkbox
              label="Show password"
              checked={isShowPassword}
              onCheck={this.updateCheck}
              checkedIcon={<Visibility />}
              uncheckedIcon={<VisibilityOff />}
            />
          </div>
          <div id="buttons">
            <RaisedButton
              label="Log In"
              labelPosition="before"
              primary={true}
              icon={<InputIcon />}
              disabled={pristine || submitting || invalid}
              onClick={handleSubmit(this.logIn)}
            />
            <RaisedButton
              label="Cancel"
              labelPosition="before"
              secondary={true}
              icon={<CancelIcon />}
              onClick={this.cancel}
            />
          </div>
        </form>
      </div>
    );
  }
}

LogInForm.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  logInUser: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  logOutUser: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'logInForm',
  validate,
})(LogInForm);
