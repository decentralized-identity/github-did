import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Paper, Button, Grid, TextField, FormControl, Typography,
} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import QRCode from 'qrcode.react';

import { ExpansionPanelList } from '../index';

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
  progress: {
    margin: `${theme.spacing.unit * 2}px auto`,
  },
  textField: {},
  publicKeysHeading: {
    marginBottom: theme.spacing.unit * 1,
  },
});

class GithubDIDDocument extends Component {
  render() {
    const { classes, didDocument } = this.props;

    const org = didDocument.id.split(':')[2].split('~')[0];
    const repo = didDocument.id.split(':')[2].split('~')[1];
    const kid = didDocument.id.split(':')[2].split('~')[2];

    return (
      <Paper className={classes.container}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={8}>
            <form noValidate autoComplete="off">
              <FormControl fullWidth disabled>
                <TextField
                  label="Organization"
                  className={classes.textField}
                  value={org}
                  margin="normal"
                />
              </FormControl>
              <FormControl fullWidth disabled>
                <TextField
                  label="Repository"
                  className={classes.textField}
                  value={repo}
                  margin="normal"
                />
              </FormControl>
              <FormControl fullWidth disabled>
                <TextField label="ID" className={classes.textField} value={kid} margin="normal" />
              </FormControl>
              <FormControl fullWidth disabled>
                <Button
                  style={{ marginTop: '28px' }}
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    window.open(`https://github.com/${org}/${repo}/tree/master/dids/${kid}.jsonld`);
                  }}
                >
                  View On Github
                </Button>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={12} sm={4}>
            <QRCode value={didDocument.id} style={{ width: '100%', height: '100%' }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant={'h5'} className={classes.publicKeysHeading}>
              Public Keys
            </Typography>
            <ExpansionPanelList
              panels={didDocument.publicKey.map(k => ({
                title: `${k.type} ${k.id.split('#kid=')[1]}`,
                children: (
                  <form noValidate autoComplete="off" style={{ width: '100%' }}>
                    <FormControl fullWidth disabled>
                      <TextField
                        label="id"
                        className={classes.textField}
                        value={k.id}
                        margin="normal"
                      />
                    </FormControl>
                    <FormControl fullWidth disabled>
                      <TextField
                        label="type"
                        className={classes.textField}
                        value={k.type}
                        margin="normal"
                      />
                    </FormControl>
                    <FormControl fullWidth disabled>
                      <TextField
                        label="owner"
                        className={classes.textField}
                        value={k.owner}
                        margin="normal"
                      />
                    </FormControl>
                    <FormControl fullWidth disabled>
                      <CopyToClipboard
                        text={k.publicKeyPem}
                        onCopy={() => {
                          this.props.snackbarMessage({
                            snackbarMessage: {
                              message: `Copied Public Key: ${k.publicKeyPem.substring(0, 32)} ...`,
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
                    </FormControl>
                  </form>
                ),
              }))}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

GithubDIDDocument.propTypes = {
  classes: PropTypes.object.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
  didDocument: PropTypes.object.isRequired,
};

export default withStyles(styles)(GithubDIDDocument);
