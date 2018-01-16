import {
  SHOW_DIALOGS,
  CLOSE_DIALOGS,
  FETCH_DIALOGS_REQUEST,
  FETCH_DIALOGS_SUCCESS,
  FETCH_DIALOGS_FAILURE,
  ADD_MESSAGE_TO_DIALOG,
  UPDATE_MESSAGES_STATUS_IN_DIALOG,
} from '../actions/dialogs';
import { UPDATE_USER_STATUS } from '../actions/users';
import { LOGOUT_USER } from '../actions/user';

const initialState = {
  isShowDialogs: false,
  loading: false,
  list: null,
  error: null,
};

export default (state = initialState, action) => {
  const { type, response: dialogs, payload, error } = action;
  switch (type) {
    case SHOW_DIALOGS:
      return { ...state, isShowDialogs: true };
    case CLOSE_DIALOGS:
      return { loading: false, list: null, error: null, isShowDialogs: false };

    case FETCH_DIALOGS_REQUEST:
      return { loading: true, list: null, error: null };
    case FETCH_DIALOGS_SUCCESS:
      return { loading: false, list: dialogs, error: null };
    case FETCH_DIALOGS_FAILURE:
      return { loading: false, list: null, error };

    case UPDATE_USER_STATUS:
      return {
        ...state,
        list: state.list && state.list.map((dialog) => {
          const user = dialog.users.find(u => u.id === payload.id);
          if (!user) {
            return dialog;
          }
          return {
            ...dialog,
            users: dialog.users.map(u => (
              u.id !== payload.id ? u : {
                ...user,
                status: payload.status,
                lastSeenAt: payload.lastSeenAt,
              }
            )),
          };
        }),
      };

    case ADD_MESSAGE_TO_DIALOG:
      return {
        ...state,
        list: state.list.map((dialog) => {
          if (dialog.id !== payload.dialogId) {
            return dialog;
          }
          const { initialId, ...restData } = payload;
          return {
            ...dialog,
            messages: [...dialog.messages, restData],
          };
        }),
      };

    case UPDATE_MESSAGES_STATUS_IN_DIALOG:
      return {
        ...state,
        list: state.list.map((dialog) => {
          if (dialog.id !== payload.dialogId) {
            return dialog;
          }
          return {
            ...dialog,
            messages: dialog.messages.map((message) => {
              if (payload.msgs && payload.msgs.find(msg => msg.id === message.id)) {
                return { ...message, status: payload.status };
              }
              if (!payload.msgs && payload.initialId && payload.initialId === message.id) {
                const { initialId, ...restData } = payload;
                return { ...message, ...restData };
              }
              return message;
            }),
          };
        }),
      };

    case LOGOUT_USER:
      return { isShowDialogs: false, loading: false, list: null, error: null };

    default:
      return state;
  }
};
