'use strict';

const gulp = tars.packages.gulp;
const gutil = tars.packages.gutil;
const chokidar = tars.packages.chokidar;
const watcherLog = tars.helpers.watcherLog;

module.exports = function () {
    return chokidar.watch(
        ['dev/*.html', 'dev/static/**', 'build/**'],
        {
            ignored: '',
            persistent: true,
            ignoreInitial: true
        }
    ).on('all', function (event, watchedPath) {
            watcherLog(event, watchedPath);
            if(tars.flags.deploywatcher) {
                gulp.start('deploy');
            }
        });
};
