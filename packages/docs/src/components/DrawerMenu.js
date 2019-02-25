import React from "react";
import PropTypes from "prop-types";
import { Link as GLink } from "gatsby";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Home,
  Code,
  Fingerprint,
  Build,
  Link,
  Directions
} from "@material-ui/icons";

class DrawerMenu extends React.Component {
  render() {
    const { classes, theme, open, handleDrawerClose } = this.props;

    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <GLink to="/">
            <ListItem button>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
          </GLink>

          <GLink to="/tutorials">
            <ListItem button>
              <ListItemIcon>
                <Directions />
              </ListItemIcon>
              <ListItemText primary={"Tutorials"} />
            </ListItem>
          </GLink>

          <ListItem
            button
            onClick={() => {
              window.open("https://github-did.com");
            }}
          >
            <ListItemIcon>
              <Fingerprint />
            </ListItemIcon>
            <ListItemText primary={"Demo"} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              window.open("https://github-did.com/api/docs");
            }}
          >
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary={"API Docs"} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              window.open("https://github.com/transmute-industries/github-did");
            }}
          >
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText primary={"Github"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              window.open("https://identity.foundation/");
            }}
          >
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText primary={"DIF"} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              window.open("https://w3c-ccg.github.io/did-spec/");
            }}
          >
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText primary={"DID"} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              window.open("https://w3c-dvcg.github.io/ld-signatures/");
            }}
          >
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText primary={"LD Signatures"} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              window.open("https://w3c.github.io/vc-data-model/");
            }}
          >
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText primary={"Credentials"} />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

DrawerMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.any.isRequired
};

export default DrawerMenu;
