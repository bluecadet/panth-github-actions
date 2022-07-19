'use strict';

const themeDir = 'BC__BASE';
const baseThemePath = `BC__BASE__THEMEDIR/${themeDir}/`;
const distPath = `${baseThemePath}/assets/dist/`;
const libPath = `${baseThemePath}/fractal/`;

/*
 * Require the path module
 */
const path                   = require('path');
const fractalCreateComponent = require('fractal-create-component');
const twigAdapter            = require('@wondrousllc/fractal-twig-drupal-adapter');
// const twigDocsAdapter        = require('@frctl/twig');

/*
 * Require the Fractal module
 */
const fractal = (module.exports = require('@frctl/fractal').create());
const twig    = twigAdapter({
  handlePrefix: '@fractal/',
});

// Setup Twig
fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');
// fractal.docs.engine(twigDocsAdapter);


// Metadata
fractal.set('project.title', 'BC__BASE__NAME');
fractal.set('project.version', 'v1.0');


// Components/Docs Settings
fractal.components.set('path', path.join(__dirname, `${libPath}`, 'patterns'));
fractal.components.set('default.preview', '@preview');
fractal.docs.set('path', path.join(__dirname, `${libPath}`, 'docs'));

// Static Assets Path
fractal.web.set('static.path', path.join(__dirname, `${distPath}`));

// Build Directory
fractal.web.set('builder.dest', 'fractal-build');

// Custom Fractal Theme - Bluecadet a11y additions
const mandelbrot = require('@frctl/mandelbrot');
const a11yTheme = require('@bluecadet/cadetfrctl')(mandelbrot, {
  favicon: '/images/fractal_favicon.png',
  styles: ['default', '/css/fractal.css'],
});

fractal.web.theme(a11yTheme);

// Statues
fractal.components.set('statuses', {
  proto: {
    label: 'Prototype',
    description: 'Do not implement.',
    color: '#c0392b',
  },
  wip: {
    label: 'WIP',
    description: 'Work in progress. Implement with caution.',
    color: '#e67e22',
  },
  ready: {
    label: 'Ready',
    description: 'Ready to implement.',
    color: '#27ae60',
  },
});


// init fractal-create-component. Can fractal cc new-component to generate components
fractalCreateComponent.init(fractal);
