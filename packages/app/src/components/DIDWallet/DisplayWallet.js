import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Paper,
  Button,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  Grid,
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';

import QRCode from 'qrcode.react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import WalletLockDialog from './WalletLockDialog';
import { ExpansionPanelList } from '../index';

const base64url = require('base64url');
const crypto = require('crypto');

const hashEncrypted = (data) => {
  const encodedPayload = base64url.encode(Buffer.from(data));
  return base64url.encode(
    crypto
      .createHash('sha256')
      .update(base64url.toBuffer(encodedPayload))
      .digest(),
  );
};

const styles = {};

class DisplayWallet extends React.Component {
  state = {
    isWalletLockDialogOpen: false,
  };

  // eslint-disable-next-line
  handleChange = name => event => {
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
    const { wallet } = this.props;
    const { isWalletLockDialogOpen } = this.state;
    const walletIsLocked = typeof wallet.data === 'string';
    const walletState = !walletIsLocked ? 'unlocked' : 'locked';

    return (
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <Grid container spacing={24}>
          {wallet.data && (
            <Grid item xs={12}>
              <Paper
                style={{
                  padding: '16px',
                  margin: '0px',
                  backgroundColor: walletState === 'unlocked' ? red[900] : '',
                }}
              >
                <WalletLockDialog
                  open={isWalletLockDialogOpen}
                  walletState={walletState}
                  onPassword={this.handleUnlock}
                />

                <div style={{ flexDirection: 'column', display: 'flex' }}>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('persist:root');
                      window.location.reload();
                    }}
                    variant="contained"
                  >
                    Delete From Browser
                  </Button>
                  <br />

                  <FormControl component="fieldset">
                    <FormLabel component="legend">DID Wallet</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch checked={walletIsLocked} onChange={this.handleChange('locked')} />
                        }
                        label={walletIsLocked ? 'Locked' : 'Unlocked!'}
                      />
                    </FormGroup>
                  </FormControl>
                  <FormControl component="fieldset" disabled>
                    {walletIsLocked && (
                      <QRCode
                        value={hashEncrypted(wallet.data)}
                        style={{ width: '100%', height: '100%' }}
                      />
                    )}
                  </FormControl>
                  <FormControl component="fieldset" disabled>
                    {!walletIsLocked
                      && Object.keys(wallet.data.keys).map((kid) => {
                        const key = wallet.data.keys[kid];
                        return (
                          <ExpansionPanelList
                            key={kid}
                            panels={[
                              {
                                title: `${key.tags[0]} ${kid.substring(0, 8)}...`,
                                children: (
                                  <div style={{ width: '100%' }}>
                                    <Typography variant="body2">{key.notes}</Typography>
                                    <br />

                                    <div>
                                      {key.tags.map(t => (
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
                                      text={key.publicKey}
                                      onCopy={() => {
                                        this.props.snackbarMessage({
                                          snackbarMessage: {
                                            message: `Copied Public Key: ${key.publicKey.substring(
                                              0,
                                              32,
                                            )} ...`,
                                            variant: 'success',
                                            open: true,
                                          },
                                        });
                                      }}
                                    >
                                      <Button
                                        style={{ marginTop: '16px' }}
                                        fullWidth
                                        variant="contained"
                                      >
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
              </Paper>
            </Grid>
          )}
        </Grid>

        <br />
        <Typography variant="body1">
          Head over to the sign page to use your imported wallet.
        </Typography>
        <br />
        <Button
          variant="contained"
          color={'primary'}
          onClick={() => {
            window.location.href = '/sign/new';
          }}
        >
          Sign with Wallet
        </Button>
      </div>
    );
  }
}

DisplayWallet.propTypes = {
  classes: PropTypes.object.isRequired,
  wallet: PropTypes.any.isRequired,
  toggleWallet: PropTypes.any.isRequired,
  snackbarMessage: PropTypes.any.isRequired,
};

export default withStyles(styles)(DisplayWallet);
