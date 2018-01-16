import {
  FIND_OR_CREATE_DIALOG_REQUEST,
  FIND_OR_CREATE_DIALOG_SUCCESS,
  FIND_OR_CREATE_DIALOG_FAILURE,
  FETCH_DIALOG_BY_ID_REQUEST,
  FETCH_DIALOG_BY_ID_SUCCESS,
  FETCH_DIALOG_BY_ID_FAILURE,
} from '../actions/dialog';
import {
  CLOSE_DIALOGS,
} from '../actions/dialogs';
import { UPDATE_USER_STATUS } from '../actions/users';
import { LOGOUT_USER } from '../actions/user';

const initialState = {
  loading: false,
  dialog: null,
  error: null,
};

export default (state = initialState, action) => {
  const { type, response: dialog, payload, error } = action;
  switch (type) {
    case FIND_OR_CREATE_DIALOG_REQUEST:
    case FETCH_DIALOG_BY_ID_REQUEST:
      return { loading: true, dialog: null, error: null };
    case FIND_OR_CREATE_DIALOG_SUCCESS:
    case FETCH_DIALOG_BY_ID_SUCCESS:
      return { loading: false, dialog, error: null };
    case FIND_OR_CREATE_DIALOG_FAILURE:
    case FETCH_DIALOG_BY_ID_FAILURE:
      return { loading: false, dialog: null, error };

    case UPDATE_USER_STATUS:
      if (state.dialog) {
        return {
          ...state,
          dialog: {
            ...state.dialog,
            users: state.dialog.users.map(user => (
              user.id !== payload.id ? user : {
                ...user,
                status: payload.status,
                lastSeenAt: payload.lastSeenAt,
              }
            )),
          },
        };
      }
      return state;

    case CLOSE_DIALOGS:
      return { loading: false, dialog: null, error: null };

    case LOGOUT_USER:
      return { loading: false, dialog: null, error: null };

    default:
      return state;
  }
};
