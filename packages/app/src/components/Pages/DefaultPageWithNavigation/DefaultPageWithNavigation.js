import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AppBar, Pages, Snackbar } from '../../index';

class DefaultPageWithNavigation extends Component {
  render() {
    const { children } = this.props;
    return (
      <Pages.Default>
        <AppBar>{children}</AppBar>
        <Snackbar />
      </Pages.Default>
    );
  }
}

DefaultPageWithNavigation.propTypes = {
  children: PropTypes.any.isRequired,
};

export default DefaultPageWithNavigation;
