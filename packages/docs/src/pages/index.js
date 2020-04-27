import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import PageCard from "../components/PageCard";
import SEO from "../components/seo";

import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";

import "./index.css";

class RootIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

    const tutorialPosts = posts.filter(p => {
      return p.node.fileAbsolutePath.indexOf("/posts/") === -1;
    });

    const blogPosts = posts.filter(p => {
      return p.node.fileAbsolutePath.indexOf("/posts/") !== -1;
    });

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <div className="layout-inner">
          <SEO
            title="Docs"
            keywords={[`DID`, `Github`, `Cryptography`, `Credentials`]}
          />

          <Link style={{ boxShadow: `none` }} to={"/tutorials"}>
            <Typography gutterBottom variant="h5">
              Tutorials
            </Typography>
          </Link>

          <Grid container spacing={24}>
            {tutorialPosts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug;
              return (
                <Grid item xs={12} sm={4} key={node.fields.slug}>
                  <PageCard
                    title={title}
                    image={node.frontmatter.image}
                    date={node.frontmatter.date}
                    slug={node.fields.slug}
                    excerpt={node.excerpt}
                  />
                </Grid>
              );
            })}
          </Grid>

          <br />
          <Link style={{ boxShadow: `none` }} to={"/blog"}>
            <Typography gutterBottom variant="h5">
              Blog
            </Typography>
          </Link>
          
          <Grid container spacing={24}>
            {blogPosts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug;
              return (
                <Grid item xs={12} sm={4} key={node.fields.slug}>
                  <PageCard
                    title={title}
                    image={node.frontmatter.image}
                    date={node.frontmatter.date}
                    slug={node.fields.slug}
                    excerpt={node.excerpt}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default RootIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC } # filter: { fileAbsolutePath: { regex: "/posts/" } }
    ) {
      edges {
        node {
          fileAbsolutePath
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            image
          }
        }
      }
    }
  }
`;
