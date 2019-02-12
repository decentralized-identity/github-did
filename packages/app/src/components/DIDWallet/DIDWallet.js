import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Button,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Chip,
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import WalletLockDialog from './WalletLockDialog';

import { ExpansionPanelList } from '../index';

class DIDWallet extends Component {
  state = {
    isWalletLockDialogOpen: false,
  };

  handleFileChange = (event) => {
    Object.keys(event.target.files).map((index) => {
      const file = event.target.files[index];
      const reader = new FileReader();
      reader.onload = (upload) => {
        this.props.importCipherTextWallet(JSON.parse(upload.target.result));
      };
      return reader.readAsText(file);
    });
  };

  // eslint-disable-next-line
  handleChange = name => (event) => {
    this.setState({
      isWalletLockDialogOpen: true,
    });
  };

  handleUnlock = (password) => {
    this.setState({
      isWalletLockDialogOpen: false,
    });
    this.props.toggleWallet(password);
    this.setState({ locked: false });
  };

  render() {
    const { isWalletLockDialogOpen } = this.state;
    const { data } = this.props.wallet;
    if (data === null) {
      return (
        <div>
          <Typography variant="h3">Warning</Typography>
          <Typography variant="body2">
            Imported a wallet into a web application should only be done for testing purposes.
          </Typography>
          <br />
          <Button
            variant="contained"
            onClick={() => {
              document.getElementById('wallet-file-input').click();
            }}
          >
            Import Encrypted Wallet
            <input
              accept="application/json"
              style={{ display: 'none' }}
              id="wallet-file-input"
              multiple
              onChange={this.handleFileChange}
              type="file"
            />
          </Button>
        </div>
      );
    }

    const walletState = data.keystore.nonce === undefined ? 'unlocked' : 'locked';

    return (
      <Paper
        style={{
          padding: '16px',
          margin: '16px',
          backgroundColor: walletState === 'unlocked' ? red[900] : '',
        }}
      >
        <WalletLockDialog
          open={isWalletLockDialogOpen}
          walletState={walletState}
          onPassword={this.handleUnlock}
        />

        {data !== null && (
          <div style={{ flexDirection: 'column', display: 'flex' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Wallet</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={walletState === 'locked'}
                      onChange={this.handleChange('locked')}
                    />
                  }
                  label={walletState === 'locked' ? 'Locked' : 'Unlocked!'}
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" disabled>
              <FormGroup>
                <TextField label="Version" value={data.version} fullWidth margin="normal" />
              </FormGroup>
              <FormGroup>
                <TextField label="Salt" value={data.salt} fullWidth margin="normal" />
              </FormGroup>
            </FormControl>
            <br />
            <br />
            <FormControl component="fieldset" disabled>
              {data.keystore.nonce === undefined
                && Object.keys(data.keystore).map((kid) => {
                  const key = data.keystore[kid];
                  return (
                    <ExpansionPanelList
                      key={kid}
                      panels={[
                        {
                          title: `${key.meta.did.signatureType} ${kid.substring(0, 8)}...`,
                          children: (
                            <div style={{ width: '100%' }}>
                              <Typography variant="body2">{key.meta.notes}</Typography>
                              <br />
                              <br />
                              <div>
                                {key.meta.tags.map(t => (
                                  <Chip
                                    key={t}
                                    label={t}
                                    variant="outlined"
                                    style={{ margin: '4px' }}
                                  />
                                ))}
                              </div>
                              <br />
                              <CopyToClipboard
                                text={key.data.publicKey}
                                onCopy={() => {
                                  this.props.snackbarMessage({
                                    snackbarMessage: {
                                      message: `Copied Public Key: ${key.data.publicKey.substring(
                                        0,
                                        32,
                                      )} ...`,
                                      variant: 'success',
                                      open: true,
                                    },
                                  });
                                }}
                              >
                                <Button style={{ marginTop: '28px' }} fullWidth variant="contained">
                                  Copy Public Key
                                </Button>
                              </CopyToClipboard>
                            </div>
                          ),
                        },
                      ]}
                    />
                  );
                })}
            </FormControl>
          </div>
        )}
      </Paper>
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
