import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import user from './user';
import users from './users';
import dialog from './dialog';
import dialogs from './dialogs';
import messages from './messages';

const rootReducer = combineReducers({
  user,
  users,
  dialog,
  dialogs,
  messages,
  form: formReducer,
});

export default rootReducer;
