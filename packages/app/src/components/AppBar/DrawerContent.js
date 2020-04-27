import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import {
  Home, Code, Star, VpnKey, Fingerprint, Search, Lock,
} from '@material-ui/icons';

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
          label: 'Resolve',
          icon: <Search />,
          link: '/resolver',
        },

        {
          label: 'Sign',
          icon: <Fingerprint />,
          link: '/sign/new',
        },
        {
          label: 'Encrypt',
          icon: <Lock />,
          link: '/encrypt/new',
        },
        {
          label: 'Wallet',
          icon: <VpnKey />,
          link: '/wallet',
        },
      ]}
    />
    <Divider />
    <MenuSection
      items={[
        {
          label: 'App Docs',
          icon: <Code />,
          link: 'https://docs.github-did.com',
        },
        {
          label: 'API Docs',
          icon: <Code />,
          link:
            window.location.hostname === 'localhost'
              ? 'http://localhost:5000/github-did/us-central1/main/docs'
              : 'https://github-did.com/api/docs',
        },
        {
          label: 'Credits',
          icon: <Star />,
          link: '/credits',
        },
        {
          label: 'Source',
          icon: <Code />,
          link: 'https://github.com/decentralized-identity/github-did',
        },
      ]}
    />
  </div>
);

DrawerContent.propTypes = {
  classes: PropTypes.any.isRequired,
};

export default DrawerContent;
