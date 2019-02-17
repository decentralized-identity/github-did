import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';

export const HTMLContent = ({ content, className }) => (
  <Typography className={className} dangerouslySetInnerHTML={{ __html: content }} />
)

const Content = ({ content, className }) => (
  <Typography className={className}>{content}</Typography>
)

Content.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
}

HTMLContent.propTypes = Content.propTypes

export default Content
