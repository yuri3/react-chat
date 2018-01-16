import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SendIcon from 'material-ui/svg-icons/content/send';

const renderTextField = ({
  input,
  placeholder,
  meta,
  handleUserIsTyping,
  ...custom
}) => (
  <div>
    <TextField
      multiLine
      fullWidth
      hintText={placeholder}
      {...input}
      {...custom}
      onChange={(event) => {
        const { value } = event.target;
        input.onChange(value);
        handleUserIsTyping();
      }}
    />
  </div>
);

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userThatTyping: {
        dialogId: null,
        fullName: null,
      },
    };
    this.isUserTyping = false;
    this.timeout = null;

    this.shouldUpdateMsgsStatusInDialog = this.shouldUpdateMsgsStatusInDialog.bind(this);
    this.updateMsgsStatusInDialog = this.updateMsgsStatusInDialog.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.updateMsgStatus = this.updateMsgStatus.bind(this);
    this.addMsgToDialog = this.addMsgToDialog.bind(this);
    this.handleUserIsTyping = this.handleUserIsTyping.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.sendAMessage = this.sendAMessage.bind(this);

    this.listeners = [
      'user_typing', 'receive_message', 'receive_message_error', 'update_message_status',
    ];

    const {
      socket, user, dialog, dialogs, reset,
    } = this.props;

    socket.on('user_typing', (payload) => {
      this.setState({ userThatTyping: { ...payload } });
    });
    socket.on('receive_message', (payload) => {
      if (payload.userId === user.id) {
        reset();
        this.updateMsgStatus(payload);
        this.addMsgToDialog(payload);
      }
      if (
        payload.userId !== user.id &&
        payload.dialogId === dialog.id
      ) {
        const { initialId, ...restData } = payload;
        const msg = { ...restData, status: 'read' };
        this.addMessage(msg);
        this.addMsgToDialog(msg);
        socket.emit('update_message_status', msg);
      }
      if (
        payload.userId !== user.id &&
        payload.dialogId !== dialog.id &&
        dialogs.find(d => d.id === payload.dialogId)
      ) {
        this.addMsgToDialog(payload);
      }
    });
    socket.on('receive_message_error', (payload) => {
      if (payload.userId === user.id) {
        this.updateMsgStatus(payload);
      }
    });
    socket.on('update_message_status', (payload) => {
      this.updateMsgStatus(payload);
    });
  }
  componentDidMount() {
    const asNotMineUnreadMsgs = (user, msg) => user.id !== msg.userId && msg.status === 'sent';
    const payload = this.shouldUpdateMsgsStatusInDialog(asNotMineUnreadMsgs);
    if (payload) {
      const { socket } = this.props;
      this.updateMsgsStatusInDialog(payload);
      socket.emit('update_message_status', payload);
    }
  }
  componentWillUnmount() {
    const { socket } = this.props;
    const asMineUnreadMsgs = (user, msg) => user.id === msg.userId && msg.status === 'sent';
    const payload = this.shouldUpdateMsgsStatusInDialog(asMineUnreadMsgs);
    if (payload) {
      this.updateMsgsStatusInDialog(payload);
    }
    this.listeners.forEach(listener => socket.off(listener));
    clearTimeout(this.timeout);
  }
  shouldUpdateMsgsStatusInDialog(pattern) {
    const { user, dialog, messages } = this.props;
    const msgs = messages.filter(msg => pattern(user, msg));
    let payload = null;
    if (msgs.length > 0) {
      payload = {
        dialogId: dialog.id,
        msgs,
        status: 'read',
      };
      return payload;
    }
    return payload;
  }
  updateMsgsStatusInDialog(payload) {
    this.props.updateMsgsStatusInDialog(payload);
  }
  addMessage(payload) {
    this.props.addMessage(payload);
  }
  updateMsgStatus(payload) {
    this.props.updateMessageStatus(payload);
  }
  addMsgToDialog(payload) {
    this.props.addMessageToDialog(payload);
  }
  handleUserIsTyping() {
    const { socket, user, dialog } = this.props;
    if (!this.isUserTyping) {
      this.isUserTyping = true;
      socket.emit('user_typing', {
        dialogId: dialog.id,
        fullName: user.fullName,
      });
      this.timeout = setTimeout(this.handleTimeout, 1000);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.handleTimeout, 1000);
    }
  }
  handleTimeout() {
    const { socket, dialog } = this.props;
    this.isUserTyping = false;
    socket.emit('user_typing', {
      dialogId: dialog.id,
      fullName: null,
    });
  }
  sendAMessage(value) {
    const {
      socket, dialog, user, messages,
    } = this.props;
    let payload = {
      id: new Date().getTime(),
      status: 'sending...',
      text: value.message.trim(),
      dialogId: dialog.id,
      userId: user.id,
      createdAt: new Date(),
    };
    if (!messages.some(msg => msg.status === 'error')) {
      this.addMessage(payload);
    } else {
      const errorMsg = messages[messages.length - 1];
      payload = {
        ...payload,
        id: errorMsg.id,
        createdAt: new Date(),
      };
    }
    socket.emit('send_message', payload);
  }
  render() {
    const { dialog, handleSubmit, pristine } = this.props;
    const { userThatTyping: { fullName, dialogId } } = this.state;
    return (
      <div>
        {fullName && dialogId === dialog.id ?
          <h5 style={{ textAlign: 'center' }}>{fullName} is typing...</h5> : null
        }
        <form onSubmit={handleSubmit(this.sendAMessage)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, paddingRight: '15px' }}>
              <Field
                name="message"
                placeholder="Type a Message..."
                handleUserIsTyping={this.handleUserIsTyping}
                component={renderTextField}
              />
            </div>
            <div>
              <FloatingActionButton
                type="submit"
                mini
                disabled={pristine}
              >
                <SendIcon />
              </FloatingActionButton>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

MessageForm.propTypes = {
  socket: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  dialog: PropTypes.shape({}).isRequired,
  dialogs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  addMessage: PropTypes.func.isRequired,
  updateMessageStatus: PropTypes.func.isRequired,
  addMessageToDialog: PropTypes.func.isRequired,
  updateMsgsStatusInDialog: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'messageForm',
})(MessageForm);
