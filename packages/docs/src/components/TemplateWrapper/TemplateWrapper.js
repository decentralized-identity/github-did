import React from "react";

import { MuiThemeProvider } from "@material-ui/core/styles";

import "../../styles/all.sass";

import theme from "../../themes/default";

export default class TemplateWrapper extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>{this.props.children()}</MuiThemeProvider>
    );
  }
}
