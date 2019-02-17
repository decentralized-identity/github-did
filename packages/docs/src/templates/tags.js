import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

import Navbar from '../components/navbar/Navbar'
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges;
    // console.log(posts);
    const postLinks = posts.map(post => (
      <li key={post.node.fields.slug}>
        <h3>{post.node.frontmatter.title}</h3>
        <small>{post.node.frontmatter.date}</small>
        <p className="excerpt">{post.node.excerpt}</p>
        <br />
        <Link to={post.node.fields.slug}>
          <Button size="small" variant="contained" color='secondary'>
            Keep reading...
          </Button>
        </Link>


      </li>
    ));
    const tag = this.props.pathContext.tag;
    const title = this.props.data.site.siteMetadata.title;
    const totalCount = this.props.data.allMarkdownRemark.totalCount;
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? '' : 's'
      } tagged with “${tag}”`;

    return (
      <Navbar >
        <Helmet title={`${tag} | ${title}`} />


        <div style={{ padding: '16px' }}>

          <Typography variant="display2" gutterBottom>{tagHeader}</Typography>

          <Typography className="techspike-tag-content" >

            <div>
              <ul>{postLinks}</ul>
            </div>
          </Typography>

        </div>

      </Navbar>
    );
  }
}

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
