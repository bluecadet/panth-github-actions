// Config object
const CONFIG             = require('./.projectconfig.js');

// Util
const gulp               = require('gulp');
const browsersync        = require('browser-sync');
const yargs              = require('yargs').argv;
const fs                 = require('fs');
const log                = require('fancy-log');
const flatmap            = require('gulp-flatmap');
const sourcemaps         = require('gulp-sourcemaps');
const gulpIf             = require('gulp-if');
const colors             = require('colors');
const using              = require('gulp-using');
// const del             = require('del');

// Sass
const sass               = require('gulp-sass');
const autoprefixer       = require('gulp-autoprefixer');
const cssnano            = require('gulp-cssnano');
const mediaQuery         = require('gulp-group-css-media-queries');
const sassGlob           = require('gulp-sass-glob');
const gulpStylelint      = require('gulp-stylelint');
const postcss            = require('gulp-postcss');
const objectFit          = require('postcss-object-fit-images');
const easingGradients    = require('postcss-easing-gradients');

// Rollup and Scripts
const rollup             = require('rollup');
const rollupEach         = require('gulp-rollup-each');
const rollupResolve      = require('@rollup/plugin-node-resolve');
const rollupBabel        = require('@rollup/plugin-babel');
const rollupCommon       = require('@rollup/plugin-commonjs');
const rollupESLint       = require('@rollup/plugin-eslint');
const uglify             = require('gulp-uglify');
const gulpEsbuild        = require('gulp-esbuild')

// Images
const imagemin           = require('gulp-imagemin');

// GitHub Pages
const ghPages            = require('gulp-gh-pages');

// Favicon
const realFavicon        = require('gulp-real-favicon');

// Definitions
const localConfig        = '.local-gulpconfig.json';
const localConfigDefault = '.ex-local-gulpconfig.json';
let production           = yargs.production ? yargs.production : false;
let watchJsPath          = yargs.watchjs ? yargs.watchjs : false;
let watchThemeOnly       = watchJsPath ? true : false;




// ----------------------------------------------------------------------------
//                             GULP TASK FUNCTIONS
// ----------------------------------------------------------------------------

//
// Reload Browsersync
//
const reload = done => {
  browsersync.reload();
  done();
};



//
// Check to see if a .gulp-config.json file exists, if
// not, creates one from .ex-gulp-config.json
//
const checkGulpConfig = done => {
  if (!CONFIG.useProxy) {
    return false;
  }

  fs.access(localConfig, fs.constants.F_OK, err => {
    if (err) {
      let source = fs.createReadStream(localConfigDefault);
      let dest = fs.createWriteStream(localConfig);
      source.pipe(dest);
      source.on('end', () => {
        log(
          `Edit the proxy value in ${localConfig} to match your virtual host. \n`
            .underline.red
        );
        process.exit(1);
      });
      source.on('error', err => {
        log(
          `Copy ${localConfigDefault} to ${localConfig} and edit the proxy value  to match your virtual host. \n`
            .underline.red
        );
        process.exit(1);
      });
    }
  });
  done();
};



//
// Check to see if a .gulp-config.json file exists, if
// not, creates one from .ex-gulp-config.json
//
const setProductionTrue = done => {
  production = true;
  done();
};



//
// Compile Sass
// Tasks for each sass file
//
const compileSass = (stream, css_dest_path) => {
  return (
    stream
      .pipe(using({ prefix: 'Processing' }))
      .pipe(gulpIf(!production, sourcemaps.init()))
      .pipe(
        gulpStylelint({
          // fix: true,
          reporters: [{ formatter: 'string', console: true }],
          failAfterError: false,
          debug: true,
        })
      )
      .pipe(sassGlob())
      .pipe(
        sass({
          includePaths: ['node_modules'],
        }).on('error', sass.logError)
      )
      .pipe(postcss([easingGradients]))
      .pipe(postcss([objectFit]))
      .pipe(
        autoprefixer({
          grid: true,
        })
      )
      .pipe(gulpIf(production, mediaQuery()))
      .pipe(gulpIf(production, cssnano()))
      .pipe(gulpIf(!production, sourcemaps.write('.')))
      .pipe(gulp.dest(css_dest_path))
      .pipe(browsersync.stream({ match: '**/*.css' }))
  );
};



//
// Compile JS with Rollup
//
const compileJS = (src_path, dest_path) => {
  return gulp
    .src([src_path])
    .pipe(using({ prefix: 'Processing' }))
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(
      rollupEach(
        {
          // external: [],
          plugins: [
            rollupCommon(),
            rollupBabel.babel({
              babelHelpers: 'bundled',
              exclude: [/\/core-js\//],
            }),
            rollupResolve.nodeResolve(),
            rollupESLint(),
          ],
        },
        {
          format: 'es',
          // globals: {}
        },
        rollup
      )
    )
    .pipe(gulpIf(!production, sourcemaps.write('.')))
    .pipe(gulpIf(production, uglify()))
    .pipe(gulp.dest(dest_path));
};

//
// Compile Images
//
const compileImages = (src_path, dest_path) => {
  return gulp
    .src(src_path)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false },
            { cleanupNumericValues: { floatPrecision: 2 } },
          ],
        }),
      ])
    )
    .pipe(gulp.dest(dest_path));
};

let watch_manifest      = {},
    sass_task_manifest  = [],
    js_task_manifest    = [],
    image_task_manifest = [];



//
// Task Builder
// ------------
// Create tasks based on inputs
//
// @param task_name {string} Name of task to be used to suffix task types
// @param base_path {string} Directory path for the task to do its thang
//
function task_builder(task_name, base_path) {
  // Build task based watch files
  let misc_watchers = [];

  CONFIG.paths.watch_files.forEach(watch_path => {
    misc_watchers.push(base_path + watch_path);
  });

  watch_manifest[task_name] = {
    sass: base_path + CONFIG.paths.sass.watch,
    js: base_path + CONFIG.paths.js.watch,
    images: base_path + CONFIG.paths.images.main,
    misc: misc_watchers,
  };

  // Setup task names
  const sass_task = 'sass:' + task_name;
  const js_task = 'js:' + task_name;
  const image_task = 'images:' + task_name;

  // Push task names into task manifest arrays
  sass_task_manifest.push(sass_task);
  js_task_manifest.push(js_task);
  image_task_manifest.push(image_task);

  //
  // SASS TASK
  // ---------
  // Can be run via `sass:TASK_NAME`
  //
  gulp.task(sass_task, () => {
    return gulp
      .src(base_path + CONFIG.paths.sass.main)
      .pipe(
        flatmap(stream => {
          return compileSass(stream, base_path + CONFIG.paths.sass.dest);
        })
      );
  });

  //
  // JS TASK
  // -------
  // Can be run via `js:TASK_NAME`
  //
  gulp.task(js_task, (done) => {
    let js_dest_path = base_path + CONFIG.paths.js.dest;

    if ( !production && watchJsPath ) {
      const onlyFiles     = watchJsPath.split(',');
      const onlyFilePaths = onlyFiles.map(filename => base_path + CONFIG.paths.js.src + '/' + filename);

      onlyFilePaths.forEach(function(srcPath, idx) {
        return gulp.src(srcPath)
          .pipe(gulpEsbuild({
              outfile: onlyFiles[idx],
              bundle: true,
              sourcemap: true,
          }))
          .pipe(gulp.dest(js_dest_path));
      });

      return done();
    }

    return compileJS(
      base_path + CONFIG.paths.js.main,
      js_dest_path
    );
  });

  //
  // MODULE IMAGES TASK
  // ------------------
  // Can be run via `images:TASK_NAME`
  //
  gulp.task(image_task, () => {
    return compileImages(
      base_path + CONFIG.paths.images.main,
      base_path + CONFIG.paths.images.dest
    );
  });
}



// ----------------------------------------------------------------------------
//                        BUILD MODULE & THEME TASKS
// ----------------------------------------------------------------------------

if ( !watchThemeOnly ) {
  CONFIG.project.modules.forEach(mod_dir => {
    task_builder('module--' + mod_dir, CONFIG.modules_path + mod_dir + '/');
  });
}

CONFIG.project.themes.forEach(theme_dir => {
  task_builder('theme--' + theme_dir, CONFIG.themes_path + theme_dir + '/');
});



// ----------------------------------------------------------------------------
//                               GULP TASKS
// ----------------------------------------------------------------------------



//
// Default Task
//
gulp.task(
  'default',
  gulp.series(
    gulp.parallel(sass_task_manifest, js_task_manifest, image_task_manifest)
  )
);



//
// Build Task
//
gulp.task(
  'build',
  gulp.series(
    setProductionTrue, // Runs with production set to true
    'default'
  )
);



//
// Watch Task
//
gulp.task('watch', () => {
  Object.keys(watch_manifest).forEach(function(task) {
    const manifest = watch_manifest[task];
    gulp.watch(manifest.sass, gulp.series('sass:' + task));
    gulp.watch(manifest.js, gulp.series('js:' + task, reload));
    gulp.watch(manifest.images, gulp.series('images:' + task));
    gulp.watch(manifest.misc, reload);
  });

  // Fractal
  if (CONFIG.fractal.use) {
    const fractalSass = CONFIG.fractal.components + '/**/*.scss';
    const fractalTwig = CONFIG.fractal.components + '/**/*.twig';
    const fractalJS   = CONFIG.fractal.components + '/**/*.js';
    const fractalJSON = CONFIG.fractal.components + '/**/*.json';

    gulp.watch(fractalSass, gulp.series('sass:theme--' + CONFIG.base_theme));
    gulp.watch([fractalTwig, fractalJS, fractalJSON], reload);
  }
});

gulp.task('watch-args', () => {
  if ( watchJsPath ) {
    const onlyFiles = watchJsPath.split(',');
    const onlyPaths = onlyFiles.map(filename => CONFIG.paths.js.src + '/' + filename);

    console.log(onlyPaths);
    // console.log(base_path + CONFIG.paths.js.src);
  }
})



// ----------------------------------------------------------------------------
//                              GULP SERVE TASKS
// ----------------------------------------------------------------------------



//
// Init CMS Browsersync Server
//
gulp.task('startsync:cms', cb => {
  if (CONFIG.useProxy) {
    const g_config = JSON.parse(fs.readFileSync(localConfig));

    if (g_config.proxy == null) {
      log(`Edit the proxy value in ${localConfig} \n`.underline.red);
      process.exit(1);
    }

    CONFIG.browsersyncOpts['proxy'] = g_config.proxy;
  }

  browsersync.init(CONFIG.browsersyncOpts, cb);
});



//
// Serve CMS in Browsersync
//
gulp.task(
  'serve',
  gulp.series(checkGulpConfig, 'default', 'startsync:cms', 'watch')
);



// ----------------------------------------------------------------------------
//                             FAVICON GENERATOR
// ----------------------------------------------------------------------------

//
// Generate Icons
//
gulp.task('favicon:generate', function(done) {
  if (CONFIG.faviconData) {
    let funcsCount = CONFIG.faviconData.length;
    CONFIG.faviconData.forEach(element => {
      realFavicon.generateFavicon(element, function () {
        --funcsCount;
        if (funcsCount <= 0) {
          done();
        }
      });

    })
  } else {
    done();
  }
});


//
// Generate Icon HTML
//
gulp.task('favicon:markup', function(done) {
  if (CONFIG.faviconData) {
    CONFIG.faviconData.forEach(element => {
      gulp
        .src([element.html_file])
        .pipe(
          realFavicon.injectFaviconMarkups(
            JSON.parse(fs.readFileSync(element.markupFile)).favicon.html_code
          )
        )
        .pipe(gulp.dest(element.dest));
    });
  }

  done();
});


//
// Run Favicon tasks together
//
gulp.task('favicon', gulp.series('favicon:generate', 'favicon:markup'));



// ----------------------------------------------------------------------------
//                                  FRACTAL
// ----------------------------------------------------------------------------
let fractal;
let logger;
let fractalServer;

if (CONFIG.fractal.use) {
  // Init Fractal
  fractal = require('./fractal.config.js');
  logger = fractal.cli.console;

  // Set Fractal Browsersync Options
  fractal.web.set('server.syncOptions', {
    open: true,
    notify: true,
  });

  // Set Fractal Browsersync Options
  fractalServer = fractal.web.server({
    sync: true,
  });
}

//
// Init Fractal Browsersync Server
//
gulp.task('startsync:fractal', function(done) {
  if (!CONFIG.fractal.use) {
    return done();
  }

  fractalServer.on('error', err => {
    logger.error(err.message);
    // return process.exit();     // Uncomment to stop watch on fail
  });

  return fractalServer.start().then(() => {
    logger.success(`Fractal server is now running at ${fractalServer.url}`);
    done();
  });
});

//
// Serve Fractal
//
gulp.task(
  'fractal',
  gulp.series(checkGulpConfig, 'default', 'startsync:fractal', 'watch')
);

//
// Build Fractal
//
gulp.task('fractal:build', function(done) {
  if (CONFIG.fractal.use) {
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) =>
      logger.update(`Exported ${completed} of ${total} items`, 'info')
    );
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
      logger.success('Fractal build completed!');
    });
  } else {
    done();
  }
});

// Copy Fractal Build to Netlify Branch
gulp.task('fractal:build:branch', function(done) {
  if (CONFIG.fractal.use) {
    return gulp.src('./fractal-build/**/*').pipe(
      ghPages({
        branch: 'netlify',
      })
    );
  } else {
    done();
  }
});

// Deploy Fractal to Netlify Branch
gulp.task(
  'fractal:deploy',
  gulp.series('build', 'fractal:build', 'fractal:build:branch')
);
