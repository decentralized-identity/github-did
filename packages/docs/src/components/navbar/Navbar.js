import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import Paper from '@material-ui/core/Paper';

const styles = {
  root: {
    flexGrow: 1,
    height: '100%'
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },

};

class AppBarWithDrawer extends React.Component {

  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  };


  toggleDrawer = (side, open) => () => {
    console.log
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes, children } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => {
              this.toggleDrawer('left', true)()
            }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              github-did
            </Typography>
            <Button color="inherit" href='https://github.com/techspiketv/github-did'>Source</Button>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
        <Paper style={{ paddingTop: '64px', height: '100%' }}>
          {children}
        </Paper>
      </div>
    );
  }

}

AppBarWithDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBarWithDrawer);
