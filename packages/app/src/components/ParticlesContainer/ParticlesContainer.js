import React, { Component } from 'react';

import Particles from 'react-particles-js';

class ParticlesContainer extends Component {
  render() {
    return (
      <Particles
        className="Particles"
        params={{
          fps_limit: 28,
          color: {
            value: '#000',
          },
          particles: {
            number: {
              value: 200,
              density: {
                enable: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 30,
              opacity: 0.4,
            },
            move: {
              speed: 1,
            },
            opacity: {
              anim: {
                enable: true,
                opacity_min: 0.05,
                speed: 2,
                sync: false,
              },
              value: 0.4,
            },
          },
          polygon: {
            enable: true,
            scale: 0.9,
            type: 'inline',
            move: {
              radius: 10,
            },
            url: './svg_masks/transmute_logo_outline.svg',
            inline: {
              arrangement: 'equidistant',
            },
            draw: {
              enable: true,
              stroke: {
                color: 'rgba(255, 255, 255, .2)',
              },
            },
          },
          retina_detect: false,
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: 'bubble',
              },
            },
            modes: {
              bubble: {
                size: 6,
                distance: 40,
              },
            },
          },
        }}
      />
    );
  }
}

export default ParticlesContainer;
