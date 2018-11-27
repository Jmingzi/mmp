const NwBuilder = require('nw-builder')
const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')

gulp.task('nw', function () {
  var nw = new NwBuilder({
    files: [path.resolve(__dirname, './src/**')],
    platforms: ['osx64'],
    macIcns: './icon/icon.icns'
  })

  // Log stuff you want
  nw.on('log', function (msg) {
    gutil.log('nw-builder', msg)
  })

  // Build returns a promise, return it so the task isn't called in parallel
  return nw.build().catch(function (err) {
    gutil.log('nw-builder', err)
  })
})

gulp.task('default', ['nw'])
