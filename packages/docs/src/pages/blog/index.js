import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';


import Content, { HTMLContent } from '../../components/Content';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Navbar from '../../components/navbar/Navbar'

const BlogIndexPage = ({ data }) => {
  const PageContent = Content;

  const localPosts = data.allMarkdownRemark.edges;

  return (

    <Navbar >

      {localPosts
        .filter(post => post.node.frontmatter.templateKey === 'blog-post')
        .map(({ node: post }) => (
          <div style={{ padding: '32px' }}>

            <Typography variant="display2" gutterBottom>
              {post.frontmatter.title}
            </Typography>

            <Typography variant="caption" gutterBottom>
              {post.frontmatter.date}
            </Typography>

            <Typography variant="body1" gutterBottom>
              {post.excerpt}
              <br />
              <br />
              <Link to={post.fields.slug}>
                <Button variant="contained" color="secondary">
                  Keep Reading
              </Button>
              </Link>
            </Typography>
          </div>
        ))}

    </Navbar>


  );
};

BlogIndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};


export const pageQuery = graphql`
  query BlogIndexQuery {
   
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

export default BlogIndexPage;

