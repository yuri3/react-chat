import {
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  ADD_MESSAGE,
  UPDATE_MESSAGE_STATUS,
} from '../actions/messages';
import {
  FETCH_DIALOG_BY_ID_REQUEST,
} from '../actions/dialog';
import { CLOSE_DIALOGS } from '../actions/dialogs';
import { LOGOUT_USER } from '../actions/user';

const initialState = {
  loading: false,
  list: null,
  error: null,
};

export default (state = initialState, action) => {
  const {
    type, response: messages, payload, error,
  } = action;
  switch (type) {
    case FETCH_DIALOG_BY_ID_REQUEST:
    case FETCH_MESSAGES_REQUEST:
      return { loading: true, list: null, error: null };
    case FETCH_MESSAGES_SUCCESS:
      return { loading: false, list: messages, error: null };
    case FETCH_MESSAGES_FAILURE:
      return { loading: false, list: null, error };

    case ADD_MESSAGE:
      return {
        ...state,
        list: [...state.list, payload],
      };

    case UPDATE_MESSAGE_STATUS:
      return {
        ...state,
        list: state.list.map((message) => {
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

    case CLOSE_DIALOGS:
      return { loading: false, list: null, error: null };

    case LOGOUT_USER:
      return { loading: false, list: null, error: null };

    default:
      return state;
  }
};
