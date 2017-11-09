
"use strict"

var gulp = require('gulp');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json', { removeComments: false });
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
//var uglify = require('gulp-uglify'); 
var csso = require('gulp-csso');
var wiredep = require('wiredep').stream;
var gutil = require('gulp-util');
var pathExists = require('path-exists');
var concat = require('gulp-concat');
var config = require('./config');
var ngAnnotate = require('gulp-ng-annotate');

var port = process.env.PORT || config.SERVER_PORT;

var APP_PATH = config.APP_PATH;
var DIST_PATH = config.DIST_PATH;


/**
 * 
 * @delete
 * 
 */

gulp.task('clean-index', function (done) {
  //del(['./public/dist/index.html'], done);
});


/**
 * @styles
 */

gulp.task('styles', function () {


  // move fonts
  gulp.src(APP_PATH + '/vendor/fonts/*.*')
    .pipe(gulp.dest(DIST_PATH + '/styles/fonts'));
  gutil.log(gutil.colors.magenta('ubuntu fonts moved'));

  // move svg image for preloader only
  gulp.src(APP_PATH + '/scss/*.svg')
    .pipe(gulp.dest(DIST_PATH + '/styles'));

  //  mobe images  
  gulp.src(APP_PATH + '/scss/images/*.*')
    .pipe(gulp.dest(DIST_PATH + '/styles/images'));

  var injectAppFiles = gulp.src([APP_PATH + '/scss/layout.scss'], { read: false });
  var injectGlobalFiles = gulp.src(APP_PATH + '/scss/global.vars.scss', { read: false });

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  var wireupConf = {
    'ignorePath': '../public/',
    exclude: ['sass-bem', 'bootstrap-sass'],//, 'bootstrap'
    directory: './public/bower_components',
  };

  return gulp.src(APP_PATH + '/scss/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest(DIST_PATH + '/styles'))
    .on('finish', function () {
      browserSync.reload()
    });
});

/**
 * 
 * @typescript
 * 
 */

gulp.task('tsScripts', function () {

  var tsSources = [
    APP_PATH + '/scripts/**/*.ts'];

  return gulp.src(tsSources)
    .pipe(tsProject())
    .pipe(ngAnnotate())
    .pipe(rename({ dirname: '' }))// remove dir structure copy
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DIST_PATH + '/js'))
    .on('finish', function () {
      setTimeout(() => {
        browserSync.reload()
      }, 300)

    });
})


gulp.task('move-html-templates', function () {
  var htmlfiles = APP_PATH + '/scripts/**/*.html';
  return gulp.src(htmlfiles)
    .pipe(rename({ dirname: '' }))// remove dir structure copy
    .pipe(gulp.dest(DIST_PATH + '/js'))
    .on('finish', function () {
      setTimeout(() => {
        browserSync.reload()
      }, 300)
    });
});


gulp.task('watch', function () {
  gulp.watch(APP_PATH + "/scripts/**/*.ts", ['tsScripts']);
  gulp.watch(APP_PATH + "/scss/*.scss", ['styles']);
  gulp.watch(APP_PATH + "/scripts/**/*.html", ['move-html-templates']);
  gulp.watch('./src' + "/index.html", ['wiredep']);
});



/**
 * 
 * @wiredep
 * 
 */

gulp.task('wiredep', ['tsScripts', 'styles', 'move-html-templates'], function () {

  var injectJSFiles = gulp.src([
    DIST_PATH + '/js/*.js',
    '!**/app.js',
    '!**/app.core.js'
  ]);

  var injectCSSFiles = gulp.src([DIST_PATH + '/styles/main.css']);
  var injectCSSOptions = {
    starttag: '<!-- inject:css -->',
    endtag: '<!-- endinject -->',
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

  var injectJSOptions = {
    starttag: '<!-- inject:prototype:{{ext}} -->',
    endtag: '<!-- endinject -->',
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

  var wireupConf = {
    'ignorePath': '../public/',
    //include:['rxjs/dist/rx.all.min.js'],
    exclude: ['sass-bem', 'bootstrap-sass', 'angular-bootstrap'], // ignore
    directory: './public/bower_components'
  }

  return gulp.src('./src/index.html')
    .pipe(wiredep(wireupConf))

    .pipe(inject(gulp.src(DIST_PATH + '/js/app.js', { read: false }),
      {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public']
      }))

    .pipe(inject(gulp.src(DIST_PATH + '/js/app.core.js', { read: false }),
      {
        starttag: '<!-- inject:appcore:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public']
      }))
    .pipe(inject(injectJSFiles, injectJSOptions))
    .pipe(inject(injectCSSFiles, injectCSSOptions))

    .pipe(gulp.dest('./public'))
    .on('finish', function () {

      setTimeout(() => {
        browserSync.reload()
      }, 300)
    });
});



gulp.task('default', ['wiredep', 'watch'], function () {

  var bSync = function () {
    browserSync.init({
      browser: ["chrome"],
      server: {
        port: port,
        open: false,
        baseDir: './public',
        middleware: function (req, res, next) {
          next();
        },
      }
    })
  }
  bSync();


});