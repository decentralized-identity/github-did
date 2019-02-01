import React, { Component } from 'react';

import { red, blue, green } from '@material-ui/core/colors';

import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';

import { Button, Typography } from '@material-ui/core';

import { Pages } from '../../index';

class Landing extends Component {
  state = {
    mobile: false,
    isCarouselOpen: false,
  };

  componentWillMount() {
    const setMobile = () => {
      this.setState({
        mobile: window.innerWidth < 640,
      });
    };
    /*eslint-disable */
    (function() {
      const throttle = function(type, name, obj) {
        obj = obj || window;
        let running = false;
        const func = function() {
          if (running) {
            return;
          }
          running = true;
          requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };
      throttle('resize', 'optimizedResize');
    })();

    // handle event
    window.addEventListener('optimizedResize', () => {
      setMobile();
    });
    setMobile();
    /* eslint-enable */
  }

  render() {
    const { mobile, isCarouselOpen } = this.state;
    return (
      <Pages.WithNavigation>
        <Typography variant="h2">Welcome to Github DID</Typography>
        <br />
        <Typography variant="body1">
          {`Decentralized Identifiers (DIDs) are a new type of identifier for verifiable,
          "self-sovereign" digital identity. DIDs are fully under the control of the DID subject,
          independent from any centralized registry, identity provider, or certificate authority.
          DIDs are URLs that relate a DID subject to means for trustable interactions with that
          subject. DIDs resolve to DID Documents — simple documents that describe how to use that
          specific DID. Each DID Document contains at least three things: cryptographic material,
          authentication suites, and service endpoints. Cryptographic material combined with
          authentication suites provide a set of mechanisms to authenticate as the DID subject
          (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable
          trusted interactions with the DID subject.`}
        </Typography>
        <br />
        <div>
          <Button
            variant="contained"
            onClick={() => {
              window.open('https://github.com/transmute-industries/github-did');
            }}
          >
            Read More on Github.com
          </Button>{' '}
          <Button
            variant="contained"
            color={'primary'}
            onClick={() => {
              this.setState({
                isCarouselOpen: true,
              });
            }}
          >
            Start Tour
          </Button>
        </div>

        <AutoRotatingCarousel
          label="Get started"
          open={isCarouselOpen}
          mobile={mobile}
          ButtonProps={{
            onClick: () => {
              this.setState({
                isCarouselOpen: false,
              });
            },
          }}
          onClose={() => {
            this.setState({
              isCarouselOpen: false,
            });
          }}
        >
          <Slide
            media={<img src="http://www.icons101.com/icon_png/size_256/id_79394/youtube.png" />}
            mediaBackgroundStyle={{ backgroundColor: red[400] }}
            style={{ backgroundColor: red[600] }}
            title="This is a very cool feature"
            subtitle="Just using this will blow your mind."
          />
          <Slide
            media={<img src="http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png" />}
            mediaBackgroundStyle={{ backgroundColor: blue[400] }}
            style={{ backgroundColor: blue[600] }}
            title="Ever wanted to be popular?"
            subtitle="Well just mix two colors and your are good to go!"
          />
          <Slide
            media={
              <img src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png" />
            }
            mediaBackgroundStyle={{ backgroundColor: green[400] }}
            style={{ backgroundColor: green[600] }}
            title="May the force be with you"
            subtitle="The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe."
          />
        </AutoRotatingCarousel>
      </Pages.WithNavigation>
    );
  }
}

export default Landing;
