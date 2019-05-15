import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    // maxWidth: 345,
  },
  media: {
    height: 140,
    backgroundSize: 'contain',
  },
};

class ImportWalletFileCard extends React.Component {
  state = {
    dialogIsOpen: false,
  };

  handleFileChange = (event) => {
    Object.keys(event.target.files).map((index) => {
      const file = event.target.files[index];
      const reader = new FileReader();
      reader.onload = (upload) => {
        this.props.importCipherTextWallet(upload.target.result);
      };
      return reader.readAsText(file);
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/mgmt/png/accessory-1.png"
          title="Import Wallet File"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Import Wallet File
          </Typography>
          <Typography component="p">
            Your web wallet is located at ~/.github-did/web.wallet.enc. <br />
            You may need to copy it some place easier to upload... Open terminal and type "ghdid
            exportWebWallet ~/Desktop/web.wallet.enc" <br />
            You will need to unlock it before it can be used. <br />
            The password is the same one used when you created your DID with the "init" command..
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            color="secondary"
            onClick={() => {
              document.getElementById('wallet-file-input').click();
            }}
          >
            Import Encrypted Wallet File
            <input
              // accept="text/plain"
              style={{ display: 'none' }}
              id="wallet-file-input"
              multiple
              onChange={this.handleFileChange}
              type="file"
            />
          </Button>
        </CardActions>
        {/* <CreateWalletDialog open={dialogIsOpen} /> */}
      </Card>
    );
  }
}

ImportWalletFileCard.propTypes = {
  classes: PropTypes.object.isRequired,
  importCipherTextWallet: PropTypes.func.isRequired,
};

export default withStyles(styles)(ImportWalletFileCard);
