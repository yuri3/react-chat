import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showAuthForm } from '../actions/user';
import { fetchAllUsers, updateUserStatus } from '../actions/users';
import {
  showDialogs,
  addMessageToDialog,
  updateMsgsStatusInDialog,
  closeDialogs,
} from '../actions/dialogs';
import { fetchMessages, addMessage, updateMessageStatus } from '../actions/messages';
import { fetchDialogAndItMessages } from '../actions/dialog';

export default (ComposedComponent) => {
  class Authentication extends Component {
    componentDidMount() {
      const {
        cookies,
        history,
        location,
        showAuthForm: showForm,
      } = this.props;
      const token = cookies.get('token');
      if (!token) {
        history.push({
          pathname: '/home',
          hash: `from=${location.pathname}`,
          state: {
            from: { pathname: location.pathname },
          },
        });
        showForm();
      }
    }

    render() {
      const { user: { isAuthenticated } } = this.props;
      if (!isAuthenticated) {
        return null;
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    user: PropTypes.shape({}).isRequired,
    users: PropTypes.shape({}).isRequired,
    dialog: PropTypes.shape({}).isRequired,
    dialogs: PropTypes.shape({}).isRequired,
    messages: PropTypes.shape({}).isRequired,
    showAuthForm: PropTypes.func.isRequired,
    updateUserStatus: PropTypes.func.isRequired,
    fetchAllUsers: PropTypes.func.isRequired,
    showDialogs: PropTypes.func.isRequired,
    fetchDialogAndItMessages: PropTypes.func.isRequired,
    fetchMessages: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    updateMessageStatus: PropTypes.func.isRequired,
    addMessageToDialog: PropTypes.func.isRequired,
    updateMsgsStatusInDialog: PropTypes.func.isRequired,
    closeDialogs: PropTypes.func.isRequired,
    location: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  const mapStateToProps = state => ({
    user: state.user,
    users: state.users,
    dialog: state.dialog,
    dialogs: state.dialogs,
    messages: state.messages,
  });

  const mapDispatchToProps = dispatch =>
    bindActionCreators({
      showAuthForm,
      updateUserStatus,
      fetchAllUsers,
      showDialogs,
      fetchDialogAndItMessages,
      fetchMessages,
      addMessage,
      updateMessageStatus,
      addMessageToDialog,
      updateMsgsStatusInDialog,
      closeDialogs,
    }, dispatch);

  return withCookies(connect(mapStateToProps, mapDispatchToProps)(Authentication));
};
