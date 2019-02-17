import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Content, { HTMLContent } from '../components/Content';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Navbar from '../components/navbar/Navbar'

import Typography from '@material-ui/core/Typography';

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet
}) => {
  const PostContent = contentComponent || Content;

  return (
    <Navbar>
      <div className="techspike-blog-post">
        {helmet || ''}
        <div className="techspike-blog-content" style={{ padding: '16px' }}>

          <Grid container spacing={8}>
            <Grid item xs={12} md={8}>
              <Typography variant="display2" >
                {description}
              </Typography>
              <br />
              <PostContent content={content} />
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="techspike-tags">
                {tags && tags.length ? (
                  <div>
                    <Typography variant="display2">Tags</Typography>
                    <br />
                    {tags.map(tag => (
                      <Link to={`/tags/${kebabCase(tag)}/`}>
                        <Button key={tag + `tag`} size="small" variant="contained" color='secondary'>
                          #{tag}
                        </Button>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </Navbar>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.string.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.instanceOf(Object)
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <BlogPostTemplate
      content={post.html}
      contentComponent={HTMLContent}
      description={post.frontmatter.description}
      helmet={<Helmet title={`${post.frontmatter.title} | Blog`} />}
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
    />
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  })
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`;
