import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Theme } from '../../index';

class DefaultPage extends Component {
  render() {
    const { children, className } = this.props;
    return (
      <Theme>
        <div className={`DefaultPage ${className || ''}`}>{children}</div>
      </Theme>
    );
  }
}

DefaultPage.propTypes = {
  className: PropTypes.any,
  children: PropTypes.any.isRequired,
};

export default DefaultPage;
