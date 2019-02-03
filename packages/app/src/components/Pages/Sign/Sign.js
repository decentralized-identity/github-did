import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DIDSigner, Pages } from '../../index';

class Sign extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <DIDSigner
          payload={this.props.match.params.base64EncodedJsonLd}
          history={this.props.history}
        />
      </Pages.WithNavigation>
    );
  }
}

Sign.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
};

export default Sign;
