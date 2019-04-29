import React from "react";

import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "./theme";

import Drawer from "./Drawer";
import Footer from "./Footer";

class Layout extends React.Component {
  render() {
    const {
      // location,
      title,
      children
    } = this.props;

    // const rootPath = `${__PATH_PREFIX__}/`;
    return (
      <MuiThemeProvider theme={theme}>
        <Drawer title={title}>
          {children}
          <Footer />
        </Drawer>
      </MuiThemeProvider>
    );
  }
}

export default Layout;
