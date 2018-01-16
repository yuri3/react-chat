import { CALL_API } from '../middleware/api';
// ---ME_FROM_TOKEN------------------------------------------------------------->
// Get current user(me) from token in localStorage
export const ME_FROM_TOKEN_REQUEST = 'ME_FROM_TOKEN_REQUEST';
export const ME_FROM_TOKEN_SUCCESS = 'ME_FROM_TOKEN_SUCCESS';
export const ME_FROM_TOKEN_FAILURE = 'ME_FROM_TOKEN_FAILURE';

const me = requestOptions => ({
  [CALL_API]: {
    types: [ME_FROM_TOKEN_REQUEST, ME_FROM_TOKEN_SUCCESS, ME_FROM_TOKEN_FAILURE],
    // endpoint: `me/from/token?token=${requestOptions.query}`,
    endpoint: 'me/from/token',
    requestOptions,
  },
});

/* eslint-disable quote-props */
export const meFromToken = token => dispatch => (
  dispatch(me({
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  }))
);
// ---SHOW_AUTH_FORM------------------------------------------------------------>
export const SHOW_AUTH_FORM = 'SHOW_AUTH_FORM';

export const showAuthForm = () => dispatch => (
  dispatch({ type: SHOW_AUTH_FORM })
);
// ---CLOSE_AUTH_FORM----------------------------------------------------------->
export const CLOSE_AUTH_FORM = 'CLOSE_AUTH_FORM';

export const closeAuthForm = () => dispatch => (
  dispatch({ type: CLOSE_AUTH_FORM })
);
// ---VALIDATE_SIGNUP_FIELDS---------------------------------------------------->
export const VALIDATE_SIGNUP_FIELDS_REQUEST = 'VALIDATE_SIGNUP_FIELDS_REQUEST';
export const VALIDATE_SIGNUP_FIELDS_SUCCESS = 'VALIDATE_SIGNUP_FIELDS_SUCCESS';
export const VALIDATE_SIGNUP_FIELDS_FAILURE = 'VALIDATE_SIGNUP_FIELDS_FAILURE';

const validateFields = requestOptions => ({
  [CALL_API]: {
    types: [
      VALIDATE_SIGNUP_FIELDS_REQUEST,
      VALIDATE_SIGNUP_FIELDS_SUCCESS,
      VALIDATE_SIGNUP_FIELDS_FAILURE,
    ],
    endpoint: 'sign_up/validate/fields',
    requestOptions,
  },
});

export const validateSignUpFields = data => dispatch => (
  dispatch(validateFields({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
);
// ---SIGNUP-------------------------------------------------------------------->
export const SIGNUP_USER_REQUEST = 'SIGNUP_USER_REQUEST';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const SIGNUP_USER_FAILURE = 'SIGNUP_USER_FAILURE';

const signUp = requestOptions => ({
  [CALL_API]: {
    types: [SIGNUP_USER_REQUEST, SIGNUP_USER_SUCCESS, SIGNUP_USER_FAILURE],
    endpoint: 'sign_up',
    requestOptions,
  },
});

export const signUpUser = data => dispatch => (
  dispatch(signUp({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
);
// ---LOGIN--------------------------------------------------------------------->
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

const logIn = requestOptions => ({
  [CALL_API]: {
    types: [LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE],
    endpoint: 'log_in',
    requestOptions,
  },
});

export const logInUser = data => dispatch => (
  dispatch(logIn({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
);
// ---LOGOUT_USER--------------------------------------------------------------->
export const LOGOUT_USER = 'LOGOUT_USER';

export const logOutUser = cookies => (dispatch) => {
  cookies.remove('token', { path: '/' });
  return dispatch({ type: LOGOUT_USER });
};
