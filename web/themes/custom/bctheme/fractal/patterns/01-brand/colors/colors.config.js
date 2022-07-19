const path = require('path');

/**
 * PATH TO SCSS FILE WITH COLORS
 * Update to point to scss file - see README
 */
const filePath  = path.join(process.cwd(), 'src/fractal/components/04-fractal-patterns/colors/example-colors-scss-file.scss');

const Colorable  = require('colorable');
const exporter   = require('sass-export').exporter;
let color_list   = false,
    color_groups = false,
    test_ready   = false,
    test_result  = false


var scssColorVarsJSON = exporter({inputFiles: filePath}).getStructured();

// Check to see if scss compiled
if (scssColorVarsJSON['site-colors-all']) {
  color_list = {};
  scssColorVarsJSON['site-colors-all'].forEach(val => {
    color_list[val.name] = val.compiledValue;
  });
} else {
  // Hard Code Colors
  color_list = {
    "$black"           : "#303030",
    "$grey-border-dark": "#666666",
    "$grey-d"          : "#8996a0",
    "$grey-l"          : "#bac5c6",
    "$parchment"       : "#f7f6f5",
    "$white"           : "#fcfcfc",
    "$link-blue"       : "#2c6db9",
  };
}


// // OPTIONAL: Sort colors by groups
// color_groups = {
//   // 'Group Name': {
//   //   "SASS_NAME": "HEX_VALUE",
//   // },
//   'Primary': {
//     "$black": "#303030",
//     "$white": "#fcfcfc",
//     "$red": "#a51c30",
//   },
//   'Secondary': {
//     "$blue-m": "#336aaa",
//     "$blue-l": "#4e84c4",
//   }
// };


function compile_colors() {
  let color_main_list = {};
  let color_group_list = {};

  if ( typeof color_list === 'object' ) {
    Object.keys(color_list).forEach( (sassName) => {
      let hex = color_list[sassName];
      color_main_list[sassName] = hex;
    });
  }

  if ( typeof color_groups === 'object' ) {
    Object.keys(color_groups).forEach( (group) => {
      if ( typeof color_groups[group] === 'object' ) {
        Object.keys(color_groups[group]).forEach( (sassName) => {
          let hex = color_groups[group][sassName];
          color_group_list[sassName] = hex;
        });
      }
    });
  }

  return Object.assign(color_group_list, color_main_list);
};


if (color_list) {
  test_ready = compile_colors();
  test_result = Colorable(test_ready, { compact: true, threshold: 0 });
}



module.exports = {
  status: 'ready',
  panels: ["notes"],
  context: {
    colors: color_list,
    groups: color_groups,
    raw: test_ready,
    results: test_result,
    type: 'matrix'
  }
};


// module.exports = {
//   title: 'Colors',
//   notes: 'Color names are equal to their sass vaiable',
//   context: {
//     colors: [
//       'blue-dark',
//       'blue-med',
//       'blue-light',
//       'orange',
//       'gray-dark',
//       'gray-light',
//       'gray-blue',
//       'white',
//     ],
//   },
// };
