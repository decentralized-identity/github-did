import React from "react";
// import PropTypes from "prop-types";
import Image from "gatsby-image";

import { StaticQuery, graphql } from "gatsby";

import {
  Paper,
  Grid,
  // Button,
  Typography,
  List,
  // ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import { Link, Code } from "@material-ui/icons";

const footerQuery = graphql`
  query FooterQuery {
    logo: file(absolutePath: { regex: "/transmute-logo-text-white.png/" }) {
      childImageSharp {
        fixed(width: 112, height: 28) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        twitter
        medium
      }
    }
  }
`;

class Footer extends React.Component {
  render() {
    return (
      <StaticQuery
        query={footerQuery}
        render={data => {
          const { author, twitter, medium } = data.site.siteMetadata;
          const { logo } = data;
          return (
            <Paper
            className={'footer'}
              style={{
                borderRadius: 0,
                padding: "16px",
                paddingBottom: "16px",
                position: "relative",
                bottom: 0
              }}
            >
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">About</Typography>
                  <br />
                  <Typography variant="body2">
                    GitHub DID is an experimental tool for developing and
                    testing the Decentralized Identity, Credentials, Signature
                    Suites and related Cryptography.
                  </Typography>
                  <br />
                  <div
                    style={{
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      window.open("https://transmute.industries");
                    }}
                  >
                    <Image
                      fixed={logo.childImageSharp.fixed}
                      alt={author}
                      style={{
                        marginBottom: "10px",
                        minWidth: 50
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">Links</Typography>
                  <List component="nav">
                    <ListItem
                      button
                      onClick={() => {
                        window.open(
                          "https://github.com/transmute-industries/github-did"
                        );
                      }}
                    >
                      <ListItemIcon>
                        <Code />
                      </ListItemIcon>
                      <ListItemText primary={"Source"} />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => {
                        window.open("http://github-did.com");
                      }}
                    >
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText inset primary="Demo" />
                    </ListItem>

                    <ListItem
                      button
                      onClick={() => {
                        window.open("https://identity.foundation/");
                      }}
                    >
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText inset primary="DIF" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    © {new Date().getFullYear()} {author} -{" "}
                    <span
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        window.open("https://twitter.com/" + twitter);
                      }}
                    >
                      Twitter
                    </span>{" "}
                    -{" "}
                    <span
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        window.open("https://medium.com/" + medium);
                      }}
                    >
                      Medium
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          );
        }}
      />
    );
  }
}

Footer.propTypes = {
  //   classes: PropTypes.object.isRequired,
  //   theme: PropTypes.object.isRequired,
  //   open: PropTypes.any.isRequired
};

export default Footer;
