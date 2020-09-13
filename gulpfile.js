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
// const { src } = require('gulp')

// clean css
const purgecss = require('gulp-purgecss')

// limpiar cache del navegador
const cachebust = require('gulp-cache-bust');

// optimizar imagenes para web con imagen min
const imagemin = require('gulp-imagemin');

// Browser-sync
// init es para levantar un servidor de desarrollo
// stream inyecta el css al hacer cambios
// reload recarga la pagina al hacer 
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;

// plumber
// ponerlo en todas las tareas despues del src
const gulpPlumber = require('gulp-plumber')



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
    .pipe(gulpPlumber())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public'))
})

gulp.task('styles', ()=>{
  return gulp
    .src('./src/css/*.css')
    .pipe(gulpPlumber())
    .pipe(concat('styles-min.css'))
    .pipe(GulpPostCss(cssPackge))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
})

gulp.task('babel', ()=>{
  return gulp
    .src('./src/js/*.js')
    .pipe(gulpPlumber())
    .pipe(concat('scripts-min.js'))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest('./public/js'))
})

// PUG
gulp.task('views',()=>{
  return gulp.src('./src/views/pages/*.pug')
    .pipe(gulpPlumber())
    .pipe(GulpPug({
      pretty: production ? false : true 
    }))
    .pipe(cachebust({
      type:'timestamp'
    }))
    .pipe(gulp.dest('public'))
})

// SASS
gulp.task('sass',()=>{
  return gulp.src('./src/scss/styles.scss')
    .pipe(gulpPlumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
})

// limpiar css 
gulp.task('clean', ()=>{
  return gulp.src('./public/css/styles.css')
    .pipe(gulpPlumber())
    .pipe(purgecss({
      content:['./public/*.html']
    }))
    .pipe(gulp.dest('./public/css'))
})

// comprimir imagenes
gulp.task('imgmin',()=>{
  return gulp.src('./src/images/*')
    .pipe(gulpPlumber())
    .pipe(imagemin([
      imagemin.gifsicle({interlaced:true}),
      imagemin.mozjpeg({quality:30, progressive:true}),
      imagemin.optipng({optimizationLevel:1})
    ]))
    .pipe(gulp.dest('./public/images'))
})


// haciendo el watch
gulp.task('default', ()=>{
  browserSync.init({
    server:'./public'
  })
  // gulp.watch('./src/*.html', gulp.series('html-min')).on("change", reload)
  // gulp.watch('./src/css/*.css', gulp.series('styles'))
  gulp.watch('./src/views/**/*.pug', gulp.series('views')).on("change", reload)
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/js/*.js', gulp.series('babel')).on("change", reload)
})