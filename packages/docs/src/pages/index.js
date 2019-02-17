import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Navbar from "../components/navbar/Navbar";

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    console.log(data);

    const localPosts = data.allMarkdownRemark.edges;
    const mediumPosts = data.allMediumPost.edges;
  
    return (
      <Navbar>
        <Grid container>
          <Grid item xs={12} md={8} style={{ padding: "16px" }} />

          <Grid item xs={12} md={4} style={{ padding: "16px" }} />
        </Grid>

        <div style={{ padding: "32px" }}>
          <Typography variant="display2" gutterBottom>
            Blog Posts
          </Typography>

          {localPosts.map(({ node: post }) => {
            return (
              <div key={post.id} style={{ paddingBottom: "32px" }}>
                <Link to={post.fields.slug}>
                  <Typography>{post.frontmatter.title}</Typography>
                </Link>
                <Typography>{post.excerpt}</Typography>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "32px" }}>
          <Typography variant="display2" gutterBottom>
            Medium Posts
          </Typography>
          {mediumPosts.map(({ node: post }) => {
            return (
              <div key={post.id} style={{ paddingBottom: "32px" }}>
                <a href={"https://medium.com/techspiketv/" + post.id}>
                  <Typography>{post.title}</Typography>
                </a>
                <Typography>{post.virtuals.subtitle}</Typography>
              </div>
            );
          })}
        </div>

     
      </Navbar>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export const pageQuery = graphql`
  query IndexQuery {
    allMediumPost(sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          id
          title
          createdAt
          virtuals {
            subtitle
            previewImage {
              imageId
            }
          }
          author {
            name
          }
        }
      }
    }

    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
