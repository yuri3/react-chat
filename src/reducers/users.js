import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  UPDATE_USER_STATUS,
} from '../actions/users';
import { LOGOUT_USER } from '../actions/user';

const initialState = {
  loading: false,
  list: null,
  error: null,
};

export default (state = initialState, action) => {
  const { type, response: users, payload, error } = action;
  switch (type) {
    case FETCH_USERS_REQUEST:
      return { loading: true, list: null, error: null };
    case FETCH_USERS_SUCCESS:
      return { loading: false, list: users, error: null };
    case FETCH_USERS_FAILURE:
      return { loading: false, list: null, error };

    case UPDATE_USER_STATUS:
      return {
        ...state,
        list: state.list.map(user => (
          user.id !== payload.id ? user : {
            ...user,
            status: payload.status,
            lastSeenAt: payload.lastSeenAt,
          }
        )),
      };

    case LOGOUT_USER:
      return { loading: false, list: null, error: null };

    default:
      return state;
  }
};
