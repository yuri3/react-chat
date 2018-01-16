import io from 'socket.io-client';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import CancelIcon from 'material-ui/svg-icons/action/highlight-off';
import Dialogs from './Dialogs';

const paperStyle = {
  margin: '10px',
  padding: '5px',
  width: '300px',
};

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
    <MenuItem primaryText="Message" leftIcon={<MessageIcon />} />
    <MenuItem primaryText="Delete" leftIcon={<CancelIcon />} />
  </IconMenu>
);

class Profile extends Component {
  constructor(props) {
    super(props);
    const { user: { user }, updateUserStatus } = props;
    this.socket = io(`http://localhost:3003?userId=${user.id}`);
    this.socket.on('user online', (payload) => {
      updateUserStatus(payload);
    });
    this.socket.on('user offline', (payload) => {
      updateUserStatus(payload);
    });
    this.handleMenuItem = this.handleMenuItem.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
  }
  componentDidMount() {
    const { fetchAllUsers } = this.props;
    fetchAllUsers();
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  handleMenuItem(data) {
    const { showDialogs } = this.props;
    showDialogs(data);
  }
  renderUsers() {
    const { users: { loading, list }, user: { user } } = this.props;
    return (
      <List>
        <Subheader>Users</Subheader>
        {loading && <h3>Loading...</h3>}
        {list && list.map(({ id, image, fullName }) => {
          if (id === user.id) { return null; }
          return (
            <div key={id}>
              <ListItem
                leftAvatar={image ? <Avatar src={image} /> : <Avatar icon={<AccountIcon />} />}
                rightIconButton={rightIconMenu(
                  () => this.handleMenuItem({
                    name: `Dialog to ${fullName}...`,
                    creator: user.fullName,
                    isPrivate: true,
                    myId: user.id,
                    dialogToId: id,
                  }))}
                primaryText={fullName}
              />
              <Divider inset={true} />
            </div>
          );
        })}
      </List>
    );
  }
  render() {
    const {
      user: { user },
      dialog: { loading: d, dialog },
      dialogs,
      messages,
      fetchDialogAndItMessages,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      closeDialogs,
    } = this.props;
    const { loading: ds, isShowDialogs } = dialogs;
    const dialogsProps = {
      socket: this.socket,
      user,
      dialog,
      dialogs,
      messages,
      fetchDialogAndItMessages,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      closeDialogs,
    };
    return (
      <div>
        <h3>Welcome to the Profile :)</h3>
        <Paper zDepth={5} style={paperStyle}>
          {this.renderUsers()}
        </Paper>
        {(d || ds) && <h3>Loading...</h3>}
        {isShowDialogs && <Dialogs {...dialogsProps} />}
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.shape({}).isRequired,
  users: PropTypes.shape({}).isRequired,
  dialog: PropTypes.shape({}).isRequired,
  dialogs: PropTypes.shape({}).isRequired,
  messages: PropTypes.shape({}).isRequired,
  updateUserStatus: PropTypes.func.isRequired,
  fetchAllUsers: PropTypes.func.isRequired,
  showDialogs: PropTypes.func.isRequired,
  fetchDialogAndItMessages: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  updateMessageStatus: PropTypes.func.isRequired,
  addMessageToDialog: PropTypes.func.isRequired,
  updateMsgsStatusInDialog: PropTypes.func.isRequired,
  closeDialogs: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default Profile;
