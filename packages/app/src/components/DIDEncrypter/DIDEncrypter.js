import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// eslint-disable-next-line
import brace from 'brace';
import AceEditor from 'react-ace';

// eslint-disable-next-line
import 'brace/mode/json';
// eslint-disable-next-line
import 'brace/theme/github';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

class DIDEncrypter extends Component {
  state = {
    jsonEditorValue: '',
    labelWidth: 0,
    fromKeyId: '',
    password: 'password',
    fromDID: namedWhitelist[0].did,
  };

  componentWillMount() {
    const { wallet, payload } = this.props;

    if (wallet.data.keystore.nonce === undefined) {
      const kid = `${namedWhitelist[0].did}#kid=${Object.keys(wallet.data.keystore)[0]}`;
      this.setState({
        fromKeyId: kid,
        toKeyId: kid,
      });
    }

    if (payload === 'new') {
      this.setState({
        jsonEditorValue: JSON.stringify(
          {
            hello: 'world',
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

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleEncrypt = () => {
    const {
      jsonEditorValue, fromKeyId, toKeyId, password,
    } = this.state;
    this.props.encrypt({
      fromKeyId,
      toKeyId,
      data: JSON.parse(jsonEditorValue),
      password,
    });
  };

  render() {
    const { wallet } = this.props;
    const { data } = wallet;
    const {
      jsonEditorValue, fromDID, fromKeyId, toKeyId, password,
    } = this.state;

    const Header = () => {
      if (data.keystore.nonce !== undefined) {
        return <Typography variant="h5">You must unlock a wallet to encrypt.</Typography>;
      }
      return <Typography variant="h5">Encrypt Payload</Typography>;
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
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="outlined-age-simple"
                >
                  From Key ID
                </InputLabel>
                <Select
                  value={fromKeyId}
                  onChange={this.handleChange}
                  input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="fromKeyId"
                      id="outlined-fromKeyId-simple"
                    />
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(data.keystore).map(kid => (
                    <MenuItem key={kid} value={`${fromDID}#kid=${kid}`}>
                      {`${kid.substring(0, 8)}...`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="To Key Id"
                  value={toKeyId}
                  onChange={(event) => {
                    this.setState({
                      toKeyId: event.target.value,
                    });
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="PGP Key Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    this.setState({
                      password: event.target.value,
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
