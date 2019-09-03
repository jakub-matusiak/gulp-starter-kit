const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cleancss = require('gulp-clean-css');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

function html(done) {
  src('./src/*.html')
  .pipe(dest('./dist/'))
  done();
}

function css(done) {
  src('./src/scss/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .on("error", sass.logError)
  .pipe(autoprefixer('last 4 versions'))
  .pipe(cleancss())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./dist/css'))
  done();
}

function js(done) {
  src('./src/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify({mangle: { toplevel: true }}))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./dist/js'))
  done();
}

function img(done) {
  src('./src/img/**/*')
  .pipe(dest('./dist/img'))
  done();
}

function watchFiles() {
  watch('src/*.html', series(html, reload));
  watch('src/scss/**/*', series(css, reload));
  watch('src/js/*.js', series(js, reload));
  watch('src/img/**/*', series(img, reload));
}

function sync() {
  browserSync.init({
    server: './dist',
    open: false
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function clean() {
  return del('./dist/');
}

exports.default = parallel(html, css, js, img, watchFiles, sync);
exports.build = series(clean, parallel(html, css, js, img));
exports.clean = clean;