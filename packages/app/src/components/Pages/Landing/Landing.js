import React, { Component } from 'react';

import {
  ParticlesContainer,
  DIDResolver,
  // DIDWallet
} from '../../index';

class Landing extends Component {
  render() {
    return (
      <div className="Landing">
        <ParticlesContainer />
        <DIDResolver />
        {/* WIP */}
        {/* <DIDWallet /> */}
      </div>
    );
  }
}

export default Landing;
