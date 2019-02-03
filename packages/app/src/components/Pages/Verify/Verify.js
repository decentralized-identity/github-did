import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DIDVerifer, Pages } from '../../index';

class Verify extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <DIDVerifer
          payload={this.props.match.params.base64EncodedJsonLd}
          history={this.props.history}
        />
      </Pages.WithNavigation>
    );
  }
}

Verify.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
};

export default Verify;
