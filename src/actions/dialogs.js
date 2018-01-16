import { CALL_API } from '../middleware/api';
import { findOrCreateDialog } from './dialog';
import { fetchMessages } from './messages';
// ---FETCH_DIALOGS------------------------------------------------------------>
export const FETCH_DIALOGS_REQUEST = 'FETCH_DIALOGS_REQUEST';
export const FETCH_DIALOGS_SUCCESS = 'FETCH_DIALOGS_SUCCESS';
export const FETCH_DIALOGS_FAILURE = 'FETCH_DIALOGS_FAILURE';

const fetchDialogs = params => ({
  [CALL_API]: {
    types: [FETCH_DIALOGS_REQUEST, FETCH_DIALOGS_SUCCESS, FETCH_DIALOGS_FAILURE],
    endpoint: `dialogs/${params.myId}`,
  },
});

export const fetchMyDialogs = params => dispatch => (
  dispatch(fetchDialogs(params))
);
// ---CLOSE_DIALOGS------------------------------------------------------------>
export const CLOSE_DIALOGS = 'CLOSE_DIALOGS';

export const closeDialogs = () => dispatch => (
  dispatch({ type: CLOSE_DIALOGS })
);
// ---SHOW_DIALOGS------------------------------------------------------------->
export const SHOW_DIALOGS = 'SHOW_DIALOGS';

export const showDialogs = data => (dispatch, getState) => {
  if (getState().dialogs.isShowDialogs) {
    closeDialogs()(dispatch);
  }
  return findOrCreateDialog(data)(dispatch).then(dialog => (
    fetchMyDialogs({ myId: data.myId })(dispatch).then(() => {
      dispatch({ type: SHOW_DIALOGS });
      return fetchMessages({ dialogId: dialog.id })(dispatch);
    })
  ));
};
// ---ADD_MESSAGE_TO_DIAlOG-------------------------------------------------->
export const ADD_MESSAGE_TO_DIALOG = 'ADD_MESSAGE_TO_DIALOG';

export const addMessageToDialog = payload => dispatch => (
  dispatch({ type: ADD_MESSAGE_TO_DIALOG, payload })
);
// ---UPDATE_MESSAGES_STATUS_IN_DIAlOG-------------------------------------------------->
export const UPDATE_MESSAGES_STATUS_IN_DIALOG = 'UPDATE_MESSAGES_STATUS_IN_DIALOG';

export const updateMsgsStatusInDialog = payload => dispatch => (
  dispatch({ type: UPDATE_MESSAGES_STATUS_IN_DIALOG, payload })
);
