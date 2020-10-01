const gulp = require('gulp');
    less = require('gulp-less');
    path = require('path');
    autoprefixer = require('gulp-autoprefixer');
    plumber = require('gulp-plumber');

gulp.task('styles', function(done){
  gulp.src('./src/less/main.less')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        done();
    }}))
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('src/css/'))
    done();
});

gulp.task('default', function(){
    gulp.watch("./src/less/*.less", gulp.series('styles'));
});
