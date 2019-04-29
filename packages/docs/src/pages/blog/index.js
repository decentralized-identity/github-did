import React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/layout";
import PageCard from "../../components/PageCard";
import SEO from "../../components/seo";

import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";

import "../index.css";

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

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

          <Typography gutterBottom variant="h5">
            Blog
          </Typography>
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

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC } 
      filter: { fileAbsolutePath: { regex: "/posts/" } }
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
