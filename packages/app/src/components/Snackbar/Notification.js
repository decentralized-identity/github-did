import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import NotificationContent from './NotificationContent';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
    });
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { message, variant } = this.props;
    const handleClose = this.props.handleClose ? this.props.handleClose : this.handleClose;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        onClose={handleClose}
      >
        <NotificationContent onClose={handleClose} variant={variant} message={message} />
      </Snackbar>
    );
  }
}

Notification.propTypes = {
  message: PropTypes.any,
  variant: PropTypes.any,
  handleClose: PropTypes.any,
  open: PropTypes.any,
};

export default Notification;
