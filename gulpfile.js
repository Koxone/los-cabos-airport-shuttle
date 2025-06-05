const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

// Compilar SCSS
function compileSass() {
  return gulp.src('src/scss/**/*.scss') // Solo archivos principales (sin _)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['src/scss']
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Procesar JavaScript
function processJs() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Optimizar imágenes comunes
function optimizeImages() {
  return gulp.src('src/images/**/*.{jpg,png,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
}

// Copiar otros assets como .webp, .ico, .mp4, .webm, etc.
function copyAssets() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.stream());
}

// Procesar HTML
function processHtml() {
  return gulp.src('src/html/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Servidor de desarrollo
function serve() {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('src/scss/**/*.scss', compileSass);
  gulp.watch('src/js/**/*.js', processJs);
  gulp.watch('src/images/**/*.{jpg,png,gif,svg}', optimizeImages);
  gulp.watch('src/assets/**/*', copyAssets);
  gulp.watch('src/html/**/*.html', processHtml);
}

// Tareas principales
const build = gulp.series(
  gulp.parallel(compileSass, processJs, optimizeImages, copyAssets, processHtml)
);

const dev = gulp.series(build, serve);

exports.build = build;
exports.default = dev;
