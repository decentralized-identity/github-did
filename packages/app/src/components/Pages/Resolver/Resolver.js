import React, { Component } from 'react';

import { DIDResolver, Pages } from '../../index';

class Resolver extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <DIDResolver />
      </Pages.WithNavigation>
    );
  }
}

export default Resolver;
