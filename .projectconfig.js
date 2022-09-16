// Path Definitions
const BASE_THEME     = 'bctheme';
const THEMES_PATH    = `web/themes/custom/`;
const MODULES_PATH   = 'web/modules/custom/';
const DEST_DIR_PATH  = 'assets/dist';
const SRC_DIR_PATH   = 'assets/src';


// Fractal Definitions
const USE_FRACTAL   = true;
const FRACTAL_PATH  = THEMES_PATH + BASE_THEME + '/fractal';

// Favivon Data
const FAVICON_DATA = false; // Replace with an array of objects from https://realfavicongenerator.net


// Config object for Gulp
module.exports = {
  base_theme: BASE_THEME,
  themes_path: THEMES_PATH,
  modules_path: MODULES_PATH,
  dest_dir_path: DEST_DIR_PATH,
  src_dir_path: SRC_DIR_PATH,
  project: {
    themes: [           // Theme Directory Names
      'bctheme'
    ],
    modules: [          // Module Directory Names
      'custom_utilities'
    ]
  },
  paths: {
    js: {
      src:     SRC_DIR_PATH + '/js',
      main:    SRC_DIR_PATH + '/js/*.js',
      watch:   SRC_DIR_PATH + '/js/**/*.js',
      dest:   DEST_DIR_PATH + '/js/'
    },
    sass: {
      src:     SRC_DIR_PATH + '/scss',
      main:    SRC_DIR_PATH + '/scss/*.scss',
      watch:   SRC_DIR_PATH + '/scss/**/*.scss',
      dest:   DEST_DIR_PATH + '/css/',
    },
    images: {
      main:    SRC_DIR_PATH + '/images/**/*',
      dest:   DEST_DIR_PATH + '/images/'
    },
    watch_files: [
      '**/*.php',
      '**/*.html',
      '**/*.twig',
    ],
  },
  fractal: {
    use: USE_FRACTAL,
    components: FRACTAL_PATH + '/patterns'
  },
  faviconData: FAVICON_DATA,
  autoprefixerBrowsers: ['last 2 versions', '> 2%', 'ie 10', 'iOS 8', 'iOS 9'],
  useProxy: true,
  browsersyncOpts: {
    ghostMode: false
  },
  testingPaths: [
    {
      "label": "Home page",
      "path": "",
      "wptOptIn": true
    },
  ]
}
