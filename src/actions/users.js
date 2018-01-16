import { CALL_API } from '../middleware/api';
// ---FETCH_USERS-------------------------------------------------------------->
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

const fetchUsers = () => ({
  [CALL_API]: {
    types: [FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE],
    endpoint: 'users',
  },
});

export const fetchAllUsers = () => dispatch => (
  dispatch(fetchUsers())
);
// ---UPDATE_USER_STATUS-------------------------------------------------------->
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';

export const updateUserStatus = payload => dispatch => (
  dispatch({ type: UPDATE_USER_STATUS, payload })
);
