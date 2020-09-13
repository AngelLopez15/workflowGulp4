// Javascript
const gulp = require('gulp')
const babel= require ('gulp-babel')
const terser = require('gulp-terser')
const concat = require('gulp-concat')
// html
const htmlmin = require('gulp-htmlmin')
// CSS
const GulpPostCss = require('gulp-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
// PUG
const GulpPug = require('gulp-pug')
// SASS
const sass = require('gulp-sass')
const { src } = require('gulp')
// clean css
const purgecss = require('gulp-purgecss')

// constante para pug
const production = false

// contantes 
const cssPackge = [
  cssnano(),
  autoprefixer()
]

gulp.task('html-min', ()=>{
  return gulp
    .src('./src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public'))
})

gulp.task('styles', ()=>{
  return gulp
    .src('./src/css/*.css')
    .pipe(concat('styles-min.css'))
    .pipe(GulpPostCss(cssPackge))
    .pipe(gulp.dest('./public/css'))
})

gulp.task('babel', ()=>{
  return gulp
    .src('./src/js/*.js')
    .pipe(concat('scripts-min.js'))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest('./public/js'))
})

// PUG
gulp.task('views',()=>{
  return gulp.src('./src/views/pages/*.pug')
    .pipe(GulpPug({
      pretty: production ? false : true 
    }))
    .pipe(gulp.dest('public'))
})

// SASS
gulp.task('sass',()=>{
  return gulp.src('./src/scss/styles.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./public/css'))
})

// limpiar css 
gulp.task('clean', ()=>{
  return gulp.src('./public/css/styles.css')
    .pipe()
})

// haciendo el watch
gulp.task('default', ()=>{
  gulp.watch('./src/*.html', gulp.series('html-min'))
  gulp.watch('./src/css/*.css', gulp.series('styles'))
  gulp.watch('./src/views/**/*.pug', gulp.series('views'))
  gulp.watch('./src/scss/**/*.pug', gulp.series('scss'))
  gulp.watch('./src/js/*.js', gulp.series('babel'))
})