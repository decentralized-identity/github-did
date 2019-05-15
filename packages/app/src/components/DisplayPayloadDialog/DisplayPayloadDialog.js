import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// eslint-disable-next-line
import brace from 'brace';
import AceEditor from 'react-ace';

// eslint-disable-next-line
import 'brace/mode/json';
// eslint-disable-next-line
import 'brace/theme/github';

class DisplayPlayloadDialog extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false, jsonData: '' });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
    });
  }

  render() {
    const { jsonData } = this.props;
    return (
      <div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Payload</DialogTitle>
          <DialogContent>
            <AceEditor
              mode="json"
              theme="github"
              style={{ width: '100%' }}
              name="jsonEditor"
              value={JSON.stringify(jsonData, null, 2)}
              editorProps={{ $blockScrolling: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DisplayPlayloadDialog.propTypes = {
  open: PropTypes.bool,
  jsonData: PropTypes.object.isRequired,
};

export default DisplayPlayloadDialog;
