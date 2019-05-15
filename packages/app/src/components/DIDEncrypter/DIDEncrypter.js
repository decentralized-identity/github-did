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
  // Paper,
  Button,
  Typography,
  Grid,
  // FormControl,
  // FormLabel,
  // FormGroup,
  // FormControlLabel,
  // Switch,
  TextField,
  // Chip,
} from '@material-ui/core';

const base64url = require('base64url');

class DIDEncrypter extends Component {
  state = {
    jsonEditorValue: '',
    fromPublicKeyId: '',
    toPublicKeyId: '',
  };

  componentWillMount() {
    const { payload } = this.props;

    this.setState({
      fromPublicKeyId: '',
      toPublicKeyId: '',
    });

    if (payload === 'new') {
      this.setState({
        jsonEditorValue: JSON.stringify(
          {
            '@context': 'https://w3id.org/identity/v1',
            givenName: 'Alice',
          },
          null,
          2,
        ),
      });
    } else {
      this.setState({
        jsonEditorValue: JSON.stringify(JSON.parse(base64url.decode(payload)), null, 2),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.encoded !== this.props.wallet.encoded) {
      this.props.history.push(`/decrypt/${nextProps.wallet.encoded}`);
    }
  }

  handleEncrypt = () => {
    const { jsonEditorValue, fromPublicKeyId, toPublicKeyId } = this.state;
    this.props.encrypt({
      fromPublicKeyId,
      toPublicKeyId,
      data: JSON.parse(jsonEditorValue),
    });
  };

  render() {
    const { wallet } = this.props;
    const { data } = wallet;
    const { jsonEditorValue, fromPublicKeyId, toPublicKeyId } = this.state;

    const Header = () => {
      if (data.keys === undefined) {
        return <Typography variant="h5">You must unlock a wallet to encrypt.</Typography>;
      }
      return (
        <div>
          <Typography variant="h5">Encrypt Payload</Typography>
          <Typography variant="body1">
            Use the Resolver, copy your second public key id and past it into from. Do the same for
            to. You can use your own public key id for both as well.
          </Typography>
        </div>
      );
    };

    return (
      <div>
        <Header />
        <br />

        <Grid container spacing={24}>
          <Grid item xs={8}>
            <AceEditor
              mode="json"
              theme="github"
              style={{ width: '100%' }}
              onChange={(newValue) => {
                // console.log('change', newValue);
                this.setState({
                  jsonEditorValue: newValue,
                });
              }}
              name="signatureEditor"
              value={jsonEditorValue}
              editorProps={{ $blockScrolling: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <form noValidate autoComplete="off">
              <FormControl fullWidth>
                <Button variant="contained" color={'primary'} onClick={this.handleEncrypt}>
                  Encrypt
                </Button>
              </FormControl>
              <br />
              <br />
              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="From Public Key ID"
                  value={fromPublicKeyId}
                  onChange={(event) => {
                    this.setState({
                      fromPublicKeyId: event.target.value,
                    });
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="To Public Key ID"
                  value={toPublicKeyId}
                  onChange={(event) => {
                    this.setState({
                      toPublicKeyId: event.target.value,
                    });
                  }}
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

DIDEncrypter.propTypes = {
  wallet: PropTypes.object.isRequired,
  payload: PropTypes.string.isRequired,
  encrypt: PropTypes.func.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
};

export default DIDEncrypter;
