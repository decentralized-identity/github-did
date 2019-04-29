import React from "react";
import { Link, graphql } from "gatsby";

import {
  Paper,
  // Grid,
  Button
  // Typography,
  // List,
  // // ListSubheader,
  // ListItem,
  // ListItemIcon,
  // ListItemText
} from "@material-ui/core";

import Layout from "../../components/layout";
import SEO from "../../components/seo";
import { rhythm } from "../../utils/typography";

import "../index.css";

class TutorialsIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <div style={{ padding: "10px" }}>
          <SEO
            title="Docs"
            keywords={[`DID`, `Github`, `Cryptography`, `Credentials`]}
          />
          <h2>Tutorials</h2>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug;
            return (
              <Paper
                key={node.fields.slug}
                style={{ padding: "8px 8px", marginBottom: "16px" }}
              >
                <h3
                  style={{
                    marginTop: "2px",
                    marginBottom: rhythm(1 / 4)
                  }}
                >
                  {title}
                </h3>
                <small>{node.frontmatter.date}</small>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />

                <div style={{ textAlign: "right" }}>
                  <Button component={Link} to={node.fields.slug}>
                    View
                  </Button>
                </div>
              </Paper>
            );
          })}
        </div>
      </Layout>
    );
  }
}

export default TutorialsIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/tutorials/" } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;
