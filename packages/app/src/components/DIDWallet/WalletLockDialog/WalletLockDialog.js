import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class WalletLockDialog extends React.Component {
  state = {
    open: false,
    password: '',
  };

  handleClose = () => {
    this.setState({ open: false, password: '' });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      password: '',
    });
  }

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleUnlock = () => {
    this.props.onPassword(this.state.password);
  };

  render() {
    const { password } = this.state;
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Enter Wallet Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the password you used to create the wallet with the github-did cli.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={this.handleChange('password')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleUnlock} color="primary" variant="contained">
              {this.props.walletState === 'locked' ? 'Unlock' : 'Lock'} Wallet
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

WalletLockDialog.propTypes = {
  open: PropTypes.bool,
  walletState: PropTypes.string.isRequired,
  onPassword: PropTypes.func.isRequired,
};

export default WalletLockDialog;
