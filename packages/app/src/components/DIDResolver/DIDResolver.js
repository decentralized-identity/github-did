import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, Grid, TextField, CircularProgress,
} from '@material-ui/core';

import { GithubDIDDocument } from '../index';

import { namedWhitelist } from '../../constants';

const styles = theme => ({
  progress: {
    margin: `${theme.spacing.unit * 2}px auto`,
  },
});

class DIDResolver extends Component {
  state = {
    currentDID: namedWhitelist[0].did,
  };

  safeResolve = () => {
    this.props.resolveDID(this.state.currentDID);
  };

  render() {
    const { did, classes } = this.props;
    const { currentDID } = this.state;

    const showProgress = currentDID && did.resolving;
    const didDocument = did.dids[currentDID];

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={11}>
          <TextField
            label="Github DID Resolver"
            value={currentDID}
            fullWidth
            onChange={(event) => {
              this.setState({
                currentDID: event.target.value,
              });
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            style={{ marginTop: '28px' }}
            fullWidth
            disabled={did.resolving}
            variant="contained"
            onClick={() => {
              this.safeResolve();
            }}
          >
            Resolve
          </Button>
        </Grid>

        {showProgress ? (
          <CircularProgress className={classes.progress} color="secondary" />
        ) : (
          didDocument && <GithubDIDDocument didDocument={didDocument} />
        )}
      </Grid>
    );
  }
}

DIDResolver.propTypes = {
  classes: PropTypes.object.isRequired,
  resolveDID: PropTypes.func.isRequired,
  did: PropTypes.object.isRequired,
};

export default withStyles(styles)(DIDResolver);
