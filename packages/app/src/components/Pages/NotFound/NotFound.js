import React, { Component } from 'react';

import { Typography, Button } from '@material-ui/core';

import { Pages, ParticlesContainer } from '../../index';

import './NotFound.css';

class NotFound extends Component {
  render() {
    return (
      <Pages.Default className="notFound">
        <ParticlesContainer />

        <div className="copy">
          <Typography variant="h1">404</Typography>
          <Typography variant="h4">{window.location.pathname} page not found.</Typography>
          <Button
            variant="contained"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Go Home
          </Button>
        </div>
      </Pages.Default>
    );
  }
}

export default NotFound;
