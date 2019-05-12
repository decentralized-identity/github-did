import React, { Component } from 'react';

import PropTypes from 'prop-types';

// eslint-disable-next-line
import brace from 'brace';
import AceEditor from 'react-ace';

// eslint-disable-next-line
import 'brace/mode/json';
// eslint-disable-next-line
import 'brace/theme/github';

import FormControl from '@material-ui/core/FormControl';

import {
  Button, Typography, Grid, TextField,
} from '@material-ui/core';
import { DisplayPayloadDialog } from '../index';

const base64url = require('base64url');

class DIDDecrypter extends Component {
  state = {
    jsonEditorValue: '',
    decryptedData: {},
    jsonPayload: {
      fromPublicKeyId: '',
      toPublicKeyId: '',
      cipherText: '',
    },
    isDisplayPayloadOpen: false,
  };

  componentWillMount() {
    const { payload } = this.props;

    const jsonPayload = JSON.parse(base64url.decode(payload));

    this.setState({
      jsonPayload,
      jsonEditorValue: JSON.stringify(jsonPayload, null, 2),
    });

    setTimeout(() => {
      this.handleDecrypt();
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.decryptedData !== this.props.wallet.decryptedData) {
      this.setState({
        isDisplayPayloadOpen: true,
        decryptedData: nextProps.wallet.decryptedData,
      });
    }
  }

  handleDecrypt = () => {
    const { jsonEditorValue } = this.state;
    this.props.decrypt({ ...JSON.parse(jsonEditorValue) });
  };

  render() {
    const {
      jsonEditorValue, jsonPayload, decryptedData, isDisplayPayloadOpen,
    } = this.state;

    const Header = () => <Typography variant="h5">Decrypt Payload</Typography>;

    return (
      <div>
        <Header />
        <br />

        <DisplayPayloadDialog open={isDisplayPayloadOpen} jsonData={decryptedData} />

        <Grid container spacing={24}>
          <Grid item xs={8}>
            <AceEditor
              mode="json"
              theme="github"
              style={{ width: '100%' }}
              disabled
              name="signatureEditor"
              value={jsonEditorValue}
              editorProps={{ $blockScrolling: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <form noValidate autoComplete="off">
              <FormControl fullWidth>
                <Button variant="contained" color={'primary'} onClick={this.handleDecrypt}>
                  Decrypt
                </Button>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  disabled
                  label="From Public Key ID"
                  value={jsonPayload.fromPublicKeyId}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>
              <br />
              <FormControl variant="outlined" fullWidth>
                <TextField
                  disabled
                  label="To Public Key ID"
                  value={jsonPayload.toPublicKeyId}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

DIDDecrypter.propTypes = {
  wallet: PropTypes.object.isRequired,
  payload: PropTypes.string.isRequired,
  decrypt: PropTypes.func.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
};

export default DIDDecrypter;
