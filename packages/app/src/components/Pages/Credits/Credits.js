import React, { Component } from 'react';

import { Typography } from '@material-ui/core';

import { Pages } from '../../index';

class Credits extends Component {
  render() {
    return (
      <Pages.WithNavigation>
        <Typography variant="h2">Credits</Typography>
        <br />
        <Typography variant="body1">
          {'Thanks to the open source projects and assets used to build this demo.'}
        </Typography>
        <br />

        <Typography variant="h3">{'Icons'}</Typography>
        <br />

        <Typography style={{ color: '#fff' }}>
          <a
            href=" https://material.io/tools/icons/?style=baseline"
            title="material ui icons"
            target="_blank"
            rel="noopener noreferrer"
          >
            Material UI Icons
          </a>
        </Typography>
        <Typography style={{ color: '#fff' }}>
          <a href="https://smashicons.com/" title="Smashicons">
            Smashicons
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>{' '}
          is licensed by{' '}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC 3.0 BY
          </a>
        </Typography>

        <Typography style={{ color: '#fff' }}>
          <a href="http://www.freepik.com/" title="Freepik">
            Freepik
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>{' '}
          is licensed by{' '}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC 3.0 BY
          </a>
        </Typography>
      </Pages.WithNavigation>
    );
  }
}

export default Credits;
