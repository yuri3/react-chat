import { CALL_API } from '../middleware/api';
import { fetchMessages } from './messages';
// ---FIND_OR_CREATE_DIALOG_REQUEST---------------------------------------------->
export const FIND_OR_CREATE_DIALOG_REQUEST = 'FIND_OR_CREATE_DIALOG_REQUEST';
export const FIND_OR_CREATE_DIALOG_SUCCESS = 'FIND_OR_CREATE_DIALOG_SUCCESS';
export const FIND_OR_CREATE_DIALOG_FAILURE = 'FIND_OR_CREATE_DIALOG_FAILURE';

const findOrCreate = requestOptions => ({
  [CALL_API]: {
    types: [
      FIND_OR_CREATE_DIALOG_REQUEST,
      FIND_OR_CREATE_DIALOG_SUCCESS,
      FIND_OR_CREATE_DIALOG_FAILURE,
    ],
    endpoint: 'dialogs',
    requestOptions,
  },
});

export const findOrCreateDialog = data => dispatch => (
  dispatch(findOrCreate({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
);
// ---FETCH_DIALOG_BY_ID_REQUEST------------------------------------------------->
export const FETCH_DIALOG_BY_ID_REQUEST = 'FETCH_DIALOG_BY_ID_REQUEST';
export const FETCH_DIALOG_BY_ID_SUCCESS = 'FETCH_DIALOG_BY_ID_SUCCESS';
export const FETCH_DIALOG_BY_ID_FAILURE = 'FETCH_DIALOG_BY_ID_FAILURE';

const fetchDialogById = params => dispatch => (
  dispatch({
    [CALL_API]: {
      types: [FETCH_DIALOG_BY_ID_REQUEST, FETCH_DIALOG_BY_ID_SUCCESS, FETCH_DIALOG_BY_ID_FAILURE],
      endpoint: `dialog/${params.dialogId}`,
    },
  })
);

const shouldFetchMessages = (state) => {
  const { messages: { loading } } = state;
  return !loading;
};

// ---FETCH_DIALOG_AND_IT_MESSAGES----------------------------------------------->
export const fetchDialogAndItMessages = data => (dispatch, getState) => (
  shouldFetchMessages(getState()) ?
    fetchDialogById(data)(dispatch).then(() =>
      fetchMessages({ dialogId: data.dialogId })(dispatch)) :
    Promise.reject({ dialogId: getState().dialog.dialog.id })
);
