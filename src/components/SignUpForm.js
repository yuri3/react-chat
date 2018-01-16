import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Cookies } from 'react-cookie';
import InputIcon from 'material-ui/svg-icons/action/input';
import CancelIcon from 'material-ui/svg-icons/action/highlight-off';
import ErrorIcon from 'material-ui/svg-icons/alert/error-outline';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import './Form.css';

import { setSession } from '../utils/auth';

const validate = (values) => {
  const errors = {};
  const requiredFields = ['firstName', 'login', 'email', 'password', 'confirmPassword'];
  requiredFields.forEach((field) => {
    if (!values[field] || values[field].trim() === '') {
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
  if (
    values.password && values.password.trim() !== '' &&
    values.confirmPassword && values.confirmPassword.trim() !== '' &&
    values.password !== values.confirmPassword
  ) {
    errors.password = 'Password and Confirm Password don\'t match!';
  }
  return errors;
};

const asyncValidate = (values, dispatch, { validateSignUpFields }) => (
  validateSignUpFields(values).catch((errors) => { throw errors; })
);

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

const style = {
  fontSize: '12px',
  color: 'rgb(244, 67, 54)',
};

const renderRadioGroup = ({ input, meta, ...rest }) => (
  <div>
    <RadioButtonGroup
      {...input}
      {...rest}
      valueSelected={input.value}
      onChange={(event, value) => input.onChange(value)}
    />
    <div style={style}>{meta.error}</div>
  </div>
);

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: false,
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.cancel = this.cancel.bind(this);
    this.signUp = this.signUp.bind(this);
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

  signUp(values) {
    const { signUpUser, cookies, history, logOutUser } = this.props;
    return signUpUser(values)
      .then(({ type, user, ...authResult }) => {
        setSession(authResult, cookies, history);
      })
      .catch((error) => {
        logOutUser(cookies);
        if (typeof error === 'string') {
          throw new SubmissionError({ _error: error });
        }
        if (typeof error === 'object') {
          throw new SubmissionError(error);
        }
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
            name="firstName"
            placeholder="First Name"
            autoFocus
            component={renderTextField}
          />
          <Field
            name="lastName"
            placeholder="Last Name"
            component={renderTextField}
          />
          <div id="radio-group">
            <Field name="sex" component={renderRadioGroup}>
              <RadioButton value="male" label="Male" />
              <RadioButton value="female" label="Female" />
            </Field>
          </div>
          <Field
            type="phone"
            name="phone"
            placeholder="Phone"
            component={renderTextField}
          />
          <Field
            name="login"
            placeholder="Login"
            component={renderTextField}
          />
          <Field
            name="email"
            placeholder="Email"
            component={renderTextField}
          />
          <Field
            type={!isShowPassword ? 'password' : ''}
            name="password"
            placeholder="Password"
            component={renderTextField}
          />
          <Field
            type={!isShowPassword ? 'password' : ''}
            name="confirmPassword"
            placeholder="Confirm Password"
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
              label="Sign Up"
              labelPosition="before"
              primary={true}
              icon={<InputIcon />}
              disabled={pristine || submitting || invalid}
              onClick={handleSubmit(this.signUp)}
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

SignUpForm.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  validateSignUpFields: PropTypes.func.isRequired,
  signUpUser: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  logOutUser: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'signUpForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['phone', 'login', 'email'],
})(SignUpForm);
