import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DIDDecrypter, Pages } from '../../index';

class Decrypt extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <DIDDecrypter
          payload={this.props.match.params.base64EncodedJsonLd}
          history={this.props.history}
        />
      </Pages.WithNavigation>
    );
  }
}

Decrypt.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
};

export default Decrypt;
