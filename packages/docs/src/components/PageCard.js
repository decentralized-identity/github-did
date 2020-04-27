import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Link } from "gatsby";

const styles = {
  card: {
    // maxWidth: 345
  },
  media: {
    height: 140
  }
};

// `https://source.unsplash.com/random?r=${title}`

function MediaCard(props) {
  const { classes, title, image, date, slug, excerpt } = props;
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={image}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <small>{date}</small>
        <br />
        <Typography
          component="p"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      </CardContent>

      <CardActions>
        <Link style={{ boxShadow: `none` }} to={slug}>
          <Button size="small" color="primary">
            Read
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MediaCard);
