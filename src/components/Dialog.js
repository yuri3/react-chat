import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import { grey400, darkBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CancelIcon from 'material-ui/svg-icons/action/highlight-off';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/editor/border-color';
import MessageForm from './MessageForm';
import './Dialog.css';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="More"
    tooltipPosition="top-center"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = fn => (
  <IconMenu iconButtonElement={iconButtonElement} onItemTouchTap={fn}>
    <MenuItem primaryText="Delete" leftIcon={<CancelIcon />} />
  </IconMenu>
);

const MsgFromUser = ({ image, text, createdAt }) => (
  <div className="user" >
    {image ?
      <Avatar src={image} size={30} /> :
      <Avatar icon={<AccountIcon />} size={30} />
    }
    <p className="user-msg">
      {text}
      <span className="user-time">
        {new Date(createdAt).toLocaleTimeString()}
      </span>
    </p>
    <div className="user-options">
      <FloatingActionButton mini={true} style={{ marginRight: '10px' }}>
        <EditIcon />
      </FloatingActionButton>
      <FloatingActionButton mini={true} style={{ marginRight: '10px' }}>
        <CancelIcon />
      </FloatingActionButton>
    </div>
  </div>
);

const MsgFromMe = ({ text, createdAt, status }) => (
  <div className="me" >
    <div className="me-options">
      <FloatingActionButton mini={true} style={{ marginRight: '10px' }}>
        <EditIcon />
      </FloatingActionButton>
      <FloatingActionButton mini={true} style={{ marginRight: '10px' }}>
        <CancelIcon />
      </FloatingActionButton>
    </div>
    <p className="me-msg">
      {text}
      <span className="me-time">
        {new Date(createdAt).toLocaleTimeString()}
      </span>
      <span className="me-time">
        {status === 'error' ?
          <span>Something bad happened! Please try again.</span> : status
        }
      </span>
    </p>
  </div>
);

class Dialog extends Component {
  constructor(props) {
    super(props);
    const { socket, user, dialog } = this.props;
    socket.on('reconnect', () => {
      if (user.id && dialog.id) {
        this.emitJoinDialog();
      }
    });
    this.emitJoinDialog = this.emitJoinDialog.bind(this);
    this.emitLeaveDialog = this.emitLeaveDialog.bind(this);
  }
  componentDidMount() {
    this.emitJoinDialog();
  }
  componentWillUnmount() {
    this.emitLeaveDialog();
    this.props.socket.off('reconnect');
  }
  emitJoinDialog() {
    const { socket, user, dialog } = this.props;
    socket.emit('join_dialog', {
      userId: user.id,
      dialogId: dialog.id,
    });
  }
  emitLeaveDialog() {
    const { socket, user, dialog } = this.props;
    socket.emit('leave_dialog', {
      userId: user.id,
      dialogId: dialog.id,
    });
  }
  render() {
    const {
      socket,
      user,
      dialog,
      dialogs,
      messages: { loading, list },
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      getDialogTo,
      getDialogToStatus,
    } = this.props;
    const dialogTo = getDialogTo(dialog);
    const status = getDialogToStatus(dialog.isPrivate, dialogTo, dialog.id);
    const userStatus = status.online || status.away || status.offline;
    /* eslint-disable no-param-reassign */
    const messages = list && list.reduce((msgsByCreatedAt, currMsg) => {
      const date = new Date(currMsg.createdAt).toLocaleDateString();
      if (!msgsByCreatedAt[date]) {
        msgsByCreatedAt[date] = {
          [currMsg.id]: currMsg,
        };
      } else {
        msgsByCreatedAt[date][currMsg.id] = currMsg;
      }
      return msgsByCreatedAt;
    }, {});
    let overlay = null;
    if (loading) {
      overlay = {
        visibility: 'visible',
        opacity: 0.2,
      };
    }
    const messageFormProps = {
      socket,
      user,
      dialog,
      dialogs,
      messages: list,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
    };
    return (
      <aside id="dialog">
        <section id="overlay" style={overlay} />
        <div>
          <ListItem
            disabled
            leftAvatar={dialogTo.image ?
              <Avatar src={dialogTo.image} /> : <Avatar icon={<AccountIcon />} />}
            primaryText={dialogTo.fullName || dialogTo.name}
            rightIconButton={rightIconMenu(() => {})}
            secondaryText={
              <p>
                <span style={{ color: darkBlack }}>
                  {userStatus === 'offline' ?
                    <span>last seen at: {
                      new Date(dialogTo.lastSeenAt).toLocaleString()
                    }
                    </span> : userStatus
                  }
                </span>
              </p>
            }
          />
          <Divider />
        </div>
        <section id="body">
          {loading &&
          <div id="loading">
            <CircularProgress size={60} thickness={7} />
          </div>
          }
          {messages && Object.keys(messages).map(date => (
            <div key={date}>
              <div className="msg-date">
                <div><strong>{date}</strong></div>
              </div>
              {Object.entries(messages[date]).map(([id, msg]) => (
                <div key={id}>
                  {msg.userId === user.id ?
                    <MsgFromMe {...msg} /> :
                    <MsgFromUser image={dialogTo.image} {...msg} />
                  }
                </div>
              ))}
            </div>
          ))}
        </section>
        {list && <MessageForm {...messageFormProps} />}
      </aside>
    );
  }
}

Dialog.propTypes = {
  socket: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  dialog: PropTypes.shape({}).isRequired,
  dialogs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  messages: PropTypes.shape({}).isRequired,
  addMessage: PropTypes.func.isRequired,
  updateMessageStatus: PropTypes.func.isRequired,
  addMessageToDialog: PropTypes.func.isRequired,
  updateMsgsStatusInDialog: PropTypes.func.isRequired,
  getDialogTo: PropTypes.func.isRequired,
  getDialogToStatus: PropTypes.func.isRequired,
};

export default Dialog;
