import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Grid } from '@material-ui/core';

import ImportWalletFileCard from './ImportWalletFileCard';
import DisplayWallet from './DisplayWallet';

class DIDWallet extends Component {
  render() {
    const {
      importCipherTextWallet, wallet, toggleWallet, snackbarMessage,
    } = this.props;

    const showInstr = wallet.data == null;

    return (
      <div>
        {!showInstr ? (
          <DisplayWallet
            wallet={wallet}
            toggleWallet={toggleWallet}
            snackbarMessage={snackbarMessage}
          />
        ) : (
          <Grid>
            <Grid item xs={12}>
              <Typography variant="h3">Warning</Typography>
              <Typography variant="body2">
                Be sure to only import your web wallet. It contains a subset of your keys.
              </Typography>

              <Typography variant="body2">
                Make sure you have created your DID before attempting to import a wallet.
              </Typography>
              <br />

              <Button
                variant="contained"
                color={'primary'}
                size={'small'}
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Create DID Instructions
              </Button>
              <br />
              <br />
            </Grid>
            <Grid item xs={12}>
              <ImportWalletFileCard importCipherTextWallet={importCipherTextWallet} />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

DIDWallet.propTypes = {
  wallet: PropTypes.object.isRequired,
  importCipherTextWallet: PropTypes.func.isRequired,
  toggleWallet: PropTypes.func.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
};

export default DIDWallet;
