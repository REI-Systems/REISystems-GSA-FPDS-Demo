var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var del = require('del');
var angularFilesort = require('gulp-angular-filesort');
// To use livereload you also need
// Chrome livereload extention
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en
var livereload = require('gulp-livereload');

var paths = {
  temp: 'temp',
  tempVendor: 'temp/vendor',
  tempVendorImages: 'temp/vendor/images',
  tempIndex: 'temp/index.html',
  
  jqxImages: ['bower_components/jqwidgets/jqwidgets/styles/images/icon-up.png','bower_components/jqwidgets/jqwidgets/styles/images/icon-down.png','bower_components/jqwidgets/jqwidgets/styles/images/icon-left.png','bower_components/jqwidgets/jqwidgets/styles/images/icon-right.png','bower_components/jqwidgets/jqwidgets/styles/images/loader.gif','bower_components/jqwidgets/jqwidgets/styles/images/sortasc.png','bower_components/jqwidgets/jqwidgets/styles/images/sortdesc.png','bower_components/jqwidgets/jqwidgets/styles/images/sortremove.png','bower_components/jqwidgets/jqwidgets/styles/images/drag.png'],
  
  index: 'app/index.html',
  appSrc: ['app/**/*', '!app/index.html', '!app/**/*.js'],
  angularFiles: ['app/**/*.js'],
  bowerSrc: 'bower_components/**/*'
}

gulp.task('default', ['watch']);

gulp.task('watch', ['copyAll','copyImages'], function(){
  livereload.listen();
  gulp.watch(paths.angularFiles, ['scripts']);
  gulp.watch(paths.bowerSrc, ['vendors']);
  gulp.watch(paths.index, ['copyAll']);
});

gulp.task('copyImages', function(){
  return gulp.src(paths.jqxImages).pipe(gulp.dest(paths.tempVendorImages));
});

gulp.task('copyAll', function(){
  var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));

  var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));
  
  var angularFiles = gulp.src(paths.angularFiles).pipe(angularFilesort()).pipe(gulp.dest(paths.temp));
  
  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.temp))
    .pipe(inject(tempVendors, {
      relative: true,
      name: 'vendorInject'
    }))
    .pipe(inject(appFiles, {
      relative: true
    }))
    .pipe(inject(angularFiles,{
      relative: true
    }))
    .pipe(gulp.dest(paths.temp))
    .pipe(livereload());
  
});

gulp.task('vendors', function(){
  
  var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));
  
  return gulp.src(paths.tempIndex)
    .pipe(inject(tempVendors,{
      relative: true,
      name: 'vendorInject'
    }))
    .pipe(gulp.dest(paths.temp))
    .pipe(livereload());
});


gulp.task('scripts', function () {

  var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));
  
  var angularFiles = gulp.src(paths.angularFiles).pipe(angularFilesort()).pipe(gulp.dest(paths.temp));

  return gulp.src(paths.tempIndex)
    .pipe(inject(appFiles, {
      relative: true
    }))
    .pipe(inject(angularFiles,{
      relative: true
    }))
    .pipe(gulp.dest(paths.temp))
    .pipe(livereload());
});

gulp.task('clean', function(){
  del([paths.temp]);
});



