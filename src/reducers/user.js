import {
  ME_FROM_TOKEN_REQUEST,
  ME_FROM_TOKEN_SUCCESS,
  ME_FROM_TOKEN_FAILURE,
  SHOW_AUTH_FORM,
  CLOSE_AUTH_FORM,
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
} from '../actions/user';

const initialState = {
  isShowAuthForm: false,
  loading: false,
  isAuthenticated: false,
  user: null,
  success: '',
  error: null,
};

export default (state = initialState, action) => {
  const { type, response = { user: null }, error } = action;
  const { user } = response;
  switch (type) {
    case ME_FROM_TOKEN_REQUEST:
      return { ...state, loading: true, isAuthenticated: false, user: null, success: '', error: null };
    case ME_FROM_TOKEN_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user, success: '', error: null };
    case ME_FROM_TOKEN_FAILURE:
      return { loading: false, isAuthenticated: false, isShowAuthForm: true, user: null, success: '', error };

    case SHOW_AUTH_FORM:
      return { ...state, isShowAuthForm: true };
    case CLOSE_AUTH_FORM:
      return { ...state, isShowAuthForm: false };

    case SIGNUP_USER_REQUEST:
      return { ...state, loading: true, isAuthenticated: false, user: null, success: '', error: null };
    case SIGNUP_USER_SUCCESS:
      return {
        loading: false,
        isAuthenticated: true,
        isShowAuthForm: false,
        user,
        success: 'You are signed up successfully.',
        error: null,
      };
    case SIGNUP_USER_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, success: '', error };

    case LOGIN_USER_REQUEST:
      return { ...state, loading: true, isAuthenticated: false, user: null, success: '', error: null };
    case LOGIN_USER_SUCCESS:
      return {
        loading: false,
        isAuthenticated: true,
        isShowAuthForm: false,
        user,
        success: 'You are signed in successfully.',
        error: null,
      };
    case LOGIN_USER_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, success: '', error };

    case LOGOUT_USER:
      return { isShowAuthForm: false, loading: false, isAuthenticated: false, user: null, success: '', error: null };

    default:
      return state;
  }
};
