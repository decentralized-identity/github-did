import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import { red, blue, lightBlue } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: blue[400],
      main: blue[700],
      dark: blue[800]
    },
    secondary: {
      light: lightBlue[400],
      main: lightBlue[500],
      dark: lightBlue[800]
    },

    error: red
  }
});
