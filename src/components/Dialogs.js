import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import { grey400, darkBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CancelIcon from 'material-ui/svg-icons/action/highlight-off';
import Dialog from './Dialog';
import './Dialogs.css';

const paperStyle = {
  margin: '10px',
  width: '1000px',
  height: 'auto',
};

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  class Selectable extends Component {
    constructor(props) {
      super(props);
      this.state = { selectedDialogId: 0 };
      this.handleRequestChange = this.handleRequestChange.bind(this);
    }
    componentWillMount() {
      this.setState({ selectedDialogId: this.props.defaultValue });
    }
    handleRequestChange(event, dialogId) {
      this.setState({ selectedDialogId: dialogId });
      this.props.fetchDialogAndItMessages({ dialogId })
        .catch(err => this.setState({ selectedDialogId: err.dialogId }));
    }
    render() {
      return (
        <ComposedComponent
          value={this.state.selectedDialogId}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  }

  Selectable.propTypes = {
    children: PropTypes.node.isRequired,
    defaultValue: PropTypes.number.isRequired,
  };

  return Selectable;
}

SelectableList = wrapState(SelectableList);

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

class Dialogs extends Component {
  constructor(props) {
    super(props);
    /* props.socket.on('receive_message', (payload) => {
      if (
        props.user.id !== payload.userId &&
        props.dialog.id !== payload.dialogId &&
        props.dialogs.list.find(dialog => dialog.id === payload.dialogId)
      ) {
        console.log('receive_message Dialogs', payload);
        console.log('addMessage');
        // props.addMessage(payload);
      }
    }); */
  }
  getDialogTo = (dialog) => {
    console.log('dialog', dialog);
    const { user, dialogs: { list } } = this.props;
    let dialogTo;
    if (dialog.isPrivate) {
      dialogTo = dialog.users ?
        dialog.users.find(u => u.id !== user.id) :
        this.getDialogTo((list.find(d => d.id === dialog.id)));
    } else {
      dialogTo = dialog;
    }
    return dialogTo;
  };
  getDialogToStatus = (isPrivate, dialogTo) => {
    if (isPrivate) {
      return {
        online: dialogTo.status === 'online' ? dialogTo.status : null,
        away: dialogTo.status === 'away' ? dialogTo.status : null,
        offline: 'offline',
      };
    }
    return undefined;
  };
  renderDialogs = () => {
    const {
      user,
      dialog,
      dialogs: { loading, list },
      fetchDialogAndItMessages,
    } = this.props;
    return (
      <SelectableList
        defaultValue={dialog ? dialog.id : 0}
        fetchDialogAndItMessages={fetchDialogAndItMessages}
      >
        <Subheader>Dialogs</Subheader>
        <Divider />
        {loading && <h3>Loading...</h3>}
        {list && list.map(({ id, isPrivate, name, image, messages, users }) => {
          let lastMessage = messages[messages.length - 1];
          const dialogTo = this.getDialogTo({ id, isPrivate, name, users });
          let lastSender = lastMessage && lastMessage.userId === user.id ?
            'You:' : `${dialogTo.fullName || dialogTo}:`;
          const status = this.getDialogToStatus(isPrivate, dialogTo);
          const userStatusColor = (status.online && '#a9ff6e') ||
            (status.away && '#ffa500') || '#bdbdbd';
          lastSender = messages.length ? lastSender : null;
          lastMessage = lastMessage || { text: '' };

          const numOfUnreadMsgs = dialog && dialog.id !== id ?
            (messages.filter(msg => msg.status === 'sent')).length : 0;

          return (
            <ListItem
              key={id}
              value={id}
              leftAvatar={
                <div>
                  <div className="user-status">
                    <div
                      className="inner-circle"
                      style={{ backgroundColor: userStatusColor }} />
                  </div>
                  {image ? <Avatar src={image} /> : <Avatar icon={<AccountIcon />} />}
                </div>
              }
              rightIconButton={rightIconMenu(() => {})}
              primaryText={`Dialog to ${dialogTo.fullName || dialogTo}...`}
              secondaryText={
                <p>
                  <span style={{ color: darkBlack }}>{lastSender}</span> {lastMessage.text}
                  {numOfUnreadMsgs > 0 &&
                    <span style={{ display: 'block', border: '1px solid red' }}>
                      {numOfUnreadMsgs}
                    </span>
                  }
                </p>
              }
              secondaryTextLines={2}
            />
          );
        })}
      </SelectableList>
    );
  };
  render() {
    const {
      socket,
      user,
      dialog,
      dialogs: { list },
      messages,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      // closeDialogs,
    } = this.props;
    const dialogProps = {
      socket,
      user,
      dialog,
      dialogs: list,
      messages,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      getDialogTo: this.getDialogTo,
      getDialogToStatus: this.getDialogToStatus,
    };
    return (
      <div>
        <Paper zDepth={5} style={paperStyle}>
          <section id="dialogs">
            <aside id="list">
              {this.renderDialogs()}
            </aside>
            <aside id="messages">
              <List>
                <Subheader>Messages</Subheader>
                <Divider />
                {dialog && <Dialog {...dialogProps} />}
              </List>
            </aside>
          </section>
        </Paper>
      </div>
    );
  }
}

Dialogs.defaultProps = {
  dialog: {},
};

Dialogs.propTypes = {
  socket: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  dialog: PropTypes.shape({}),
  dialogs: PropTypes.shape({}).isRequired,
  messages: PropTypes.shape({}).isRequired,
  fetchDialogAndItMessages: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  updateMessageStatus: PropTypes.func.isRequired,
  addMessageToDialog: PropTypes.func.isRequired,
  updateMsgsStatusInDialog: PropTypes.func.isRequired,
  closeDialogs: PropTypes.func.isRequired,
};

export default Dialogs;
