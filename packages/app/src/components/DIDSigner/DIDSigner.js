import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// eslint-disable-next-line
import brace from "brace";
import AceEditor from "react-ace";

// eslint-disable-next-line
import "brace/mode/json";
// eslint-disable-next-line
import "brace/theme/github";

import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
  TextField
  // Chip,
} from "@material-ui/core";
// import { namedWhitelist } from '../../constants';

const base64url = require("base64url");

class DIDSigner extends Component {
  state = {
    jsonEditorValue: "",
    labelWidth: 0,
    kid: "",
    did: ""
  };

  componentWillMount() {
    const { wallet, payload } = this.props;

    if (wallet.data.keys) {
      this.setState({
        kid: Object.keys(wallet.data.keys)[0]
      });
    }

    if (payload === "new") {
      this.setState({
        jsonEditorValue: JSON.stringify(
          {
            "@context": [
              "https://w3id.org/did/v1",
              {
                schema: "http://schema.org/",
                action: "schema:action"
              }
            ],
            action: "AuthenticateMe"
          },
          null,
          2
        )
      });
    } else {
      this.setState({
        jsonEditorValue: JSON.stringify(
          JSON.parse(base64url.decode(payload)),
          null,
          2
        )
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.encoded !== this.props.wallet.encoded) {
      this.props.history.push(`/verify/${nextProps.wallet.encoded}`);
    }
  }

  handleSign = () => {
    const { jsonEditorValue, did, kid } = this.state;
    // console.log({ jsonEditorValue, did, kid });
    this.props.sign({
      payload: JSON.parse(jsonEditorValue),
      did,
      kid
    });
  };

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  render() {
    const { wallet } = this.props;
    const { data } = wallet;
    const { jsonEditorValue, did } = this.state;

    const Header = () => {
      if (data.keys === undefined) {
        return (
          <Typography variant="h5">
            You must unlock a wallet to sign.
          </Typography>
        );
      }
      return <Typography variant="h5">Sign Payload</Typography>;
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
              style={{ width: "100%" }}
              onChange={newValue => {
                // console.log('change', newValue);
                this.setState({
                  jsonEditorValue: newValue
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
                <Button
                  variant="contained"
                  color={"primary"}
                  onClick={this.handleSign}
                  disabled={!this.state.did}
                >
                  Sign
                </Button>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="DID"
                  value={did}
                  placeholder={"Enter your DID here."}
                  onChange={event => {
                    this.setState({
                      did: event.target.value
                    });
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  ref={ref => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="outlined-age-simple"
                >
                  Key ID
                </InputLabel>
                <Select
                  value={this.state.kid}
                  onChange={event => {
                    this.setState({
                      kid: event.target.value
                    });
                  }}
                  input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="kid"
                      id="outlined-kid-simple"
                    />
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(data.keys).map(kid => (
                    <MenuItem key={kid} value={kid}>
                      {`${kid.substring(0, 8)}...`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

DIDSigner.propTypes = {
  wallet: PropTypes.object.isRequired,
  payload: PropTypes.string.isRequired,
  sign: PropTypes.func.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired
};

export default DIDSigner;
