import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import CodeIcon from '@material-ui/icons/Code';

import { Home, Code } from '@material-ui/icons';

import MenuSection from './MenuSection';

const DrawerContent = ({ classes }) => (
  <div>
    <div className={classes.toolbar} />
    <Divider />
    <MenuSection
      items={[
        {
          label: 'Home',
          icon: <Home />,
          link: '/',
        },
        {
          label: 'Resolver',
          icon: <Code />,
          link: '/resolver',
        },
      ]}
    />
    <Divider />
    <MenuSection
      items={[
        {
          label: 'Source',
          icon: <CodeIcon />,
          link: 'https://github.com/transmute-industries/github-did',
        },
      ]}
    />
  </div>
);

DrawerContent.propTypes = {
  classes: PropTypes.any.isRequired,
};

export default DrawerContent;
