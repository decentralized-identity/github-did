import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Paper, Button } from '@material-ui/core';

import defaultWallet from './wallet.json';

import constants from '../../constants';

class DIDWallet extends Component {
  state = {
    wallet: defaultWallet,
    did: constants.serverDID,
  };

  handleFileChange = (event) => {
    Object.keys(event.target.files).map((index) => {
      const file = event.target.files[index];
      const reader = new FileReader();
      reader.onload = (upload) => {
        console.log(upload.target.result);
        this.setState({
          wallet: JSON.parse(upload.target.result),
        });
      };

      //   reader.readAsDataURL(file);
      return reader.readAsText(file);
    });
  };

  render() {
    const { wallet } = this.state;
    return (
      <Paper style={{ padding: '16px', margin: '16px' }}>
        {wallet === null && (
          <Button
            variant="contained"
            onClick={() => {
              document.getElementById('wallet-file-input').click();
            }}
          >
            Import Wallet
            <input
              accept="application/json"
              style={{ display: 'none' }}
              id="wallet-file-input"
              multiple
              onChange={this.handleFileChange}
              type="file"
            />
          </Button>
        )}

        {wallet !== null && <div>Wallet Loaded...</div>}
      </Paper>
    );
  }
}

DIDWallet.propTypes = {
  // did: PropTypes.object.isRequired,
};

export default DIDWallet;
