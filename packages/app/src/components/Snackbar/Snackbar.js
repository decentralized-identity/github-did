import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Notification from './Notification';

class Snackbar extends Component {
  state = {
    message: '',
    variant: '',
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props) || !this.state.open) {
      this.setState({
        ...nextProps.snackbar.snackbarMessage,
      });
      // setTimeout(() => {
      //   this.setState({
      //     open: false,
      //   });
      // }, 3 * 1000);
    }
  }

  render() {
    const { message, variant, open } = this.state;
    return <Notification message={message} variant={variant} open={open} />;
  }
}

Snackbar.propTypes = {
  snackbar: PropTypes.any,
};

export default Snackbar;
