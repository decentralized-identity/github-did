import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function ExpansionPanelList({ classes, panels }) {
  return (
    <div className={classes.root}>
      {panels
        && panels.map(panel => (
          <ExpansionPanel disabled={panel.disabled} key={panel.title}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{panel.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>{panel.children}</ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </div>
  );
}

ExpansionPanelList.propTypes = {
  classes: PropTypes.object.isRequired,
  panels: PropTypes.array.isRequired,
};

export default withStyles(styles)(ExpansionPanelList);
