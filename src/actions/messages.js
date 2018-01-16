import { CALL_API } from '../middleware/api';
// ---FETCH_MESSAGES----------------------------------------------->
export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';

const messages = params => ({
  [CALL_API]: {
    types: [FETCH_MESSAGES_REQUEST, FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_FAILURE],
    endpoint: `messages/${params.dialogId}`,
  },
});

export const fetchMessages = params => dispatch => (
  dispatch(messages(params))
);
// ---ADD_MESSAGE-------------------------------------------------->
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const addMessage = payload => dispatch => (
  dispatch({ type: ADD_MESSAGE, payload })
);
// ---UPDATE_MESSAGE_STATUS---------------------------------------->
export const UPDATE_MESSAGE_STATUS = 'UPDATE_MESSAGE_STATUS';

export const updateMessageStatus = payload => dispatch => (
  dispatch({ type: UPDATE_MESSAGE_STATUS, payload })
);
