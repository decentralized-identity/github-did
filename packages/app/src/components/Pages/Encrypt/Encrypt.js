import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DIDEncrypter, Pages } from '../../index';

class Encrypt extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <DIDEncrypter
          payload={this.props.match.params.base64EncodedJsonLd}
          history={this.props.history}
        />
      </Pages.WithNavigation>
    );
  }
}

Encrypt.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
};

export default Encrypt;
