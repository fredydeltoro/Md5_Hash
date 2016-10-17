var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

gulp.task('test', function () {
  gulp.src('./assets/js/test/test.js')
  .pipe(istanbul({includeUntested: true}))
  .on('finish', function () {
    gulp.src('./assets/js/test/test.js')
         .pipe(mocha({reporter: 'spec'}))
         .pipe(istanbul.writeReports({
           dir: './assets/unit-test-coverage',
           reporters: [ 'lcov' ],
           reportOpts: { dir: './assets/unit-test-coverage'}
       }))
  })
})

gulp.task('watch', function () {
  gulp.watch('./index.js', ['test'])
})
