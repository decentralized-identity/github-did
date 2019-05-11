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
import { namedWhitelist } from '../../constants';

const base64url = require('base64url');

class DIDVerifer extends Component {
  state = {
    jsonEditorValue: '',
    labelWidth: 0,
    kid: '',
    creator: namedWhitelist[0].did,
  };

  componentWillMount() {
    const { payload } = this.props;

    const jsonPayload = JSON.parse(base64url.decode(payload));

    this.setState({
      jsonEditorValue: JSON.stringify(jsonPayload, null, 2),
      creator: jsonPayload.proof.creator.split('#kid=')[0],
      kid: jsonPayload.proof.creator.split('#kid=')[1],
    });

    setTimeout(() => {
      this.handleVerify();
    }, 500);
  }

  handleVerify = () => {
    this.props.verify({ signedData: JSON.parse(this.state.jsonEditorValue) });
  };

  render() {
    const { jsonEditorValue, creator, kid } = this.state;

    const Header = () => <Typography variant="h5">Verify Payload</Typography>;

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
                <Button variant="contained" color={'primary'} onClick={this.handleVerify}>
                  Verify
                </Button>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  disabled
                  label="DID"
                  value={creator}
                  onChange={(event) => {
                    this.setState({
                      creator: event.target.value,
                    });
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>
              <br />
              <br />
              <FormControl variant="outlined" fullWidth>
                <TextField
                  disabled
                  label="Key ID"
                  value={kid}
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

DIDVerifer.propTypes = {
  wallet: PropTypes.object.isRequired,
  payload: PropTypes.string.isRequired,
  verify: PropTypes.func.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
};

export default DIDVerifer;
