import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { history } from '../../redux/store';

const MenuSection = ({ items }) => (
  <List>
    {items.map(({ label, icon, link }) => (
      <ListItem
        button
        key={label}
        onClick={() => {
          if (link.indexOf('http') === -1) {
            history.push(link);
          } else {
            window.open(link);
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    ))}
  </List>
);

MenuSection.propTypes = {
  items: PropTypes.any.isRequired,
};

export default MenuSection;
