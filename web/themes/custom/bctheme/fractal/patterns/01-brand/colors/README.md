# Color Swatches

**REMOVE THIS README IF USED IN PRODUCTION.** This is a Fractal specific component to display color swatches. It should not effect or be effected by anything on the site itself.

## Usage

Install [Colorable](https://github.com/jxnblk/colorable) via npm:

`npm i --save-dev colorable`

## Config Values

### `const color_list = {}`

This variable should be an object of key/value pairings, in which the key is the NAME of the color, and the value is the HEX value for the color, similar to the way you declare sass variables:

```
const color_list = {
  '$black': '#000',
  '$white': '#FFF',
};
```

Colors will be displayed as one group.

### `const color_groups = {}`

This variable allows colors to be seperated into named groups, if you prefer that for presentation. The object should be key/value parings, in which the key is the name of the group, and the value is an object made up of color key/value pairs. These objects should be key/value pairings, in which the key is the NAME of the color, and the value is the HEX value for the color, similar to the way you declare sass variables:

```
const color_groups = {
  'Primary': {
    '$black': '#000',
    '$white': '#FFF',
  },
  'Secondary': {
    '$blue': '#191A22',
  },
};
```

## Accessibility Color Tests

Color values are taken from both the `color_list` and the `color_groups` lists. All colors are checked for AA and AAA contrast compliance as the Hex value for text on every other color.