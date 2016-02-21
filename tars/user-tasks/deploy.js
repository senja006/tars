'use strict';

const gulp = tars.packages.gulp;
const plumber = tars.packages.plumber;
const notify = tars.packages.notify;
const tarsConfig = tars.config;
const ftp = require( 'vinyl-ftp' );
const fs = require('fs');
const del = tars.packages.del;

/**
 * Деплой проекта
 * Для запуска
 * tars start deploy --flags '--dev/--build, --html, --frontend/--backend/--local/--server, --deploywatcher'
 */

let folderMarkup = getFolderMarkup();
// let tasks = [tars.flags.dev ? 'dev': 'build'];
let config = getConfig();
let localFilesGlob = [
    '!' + folderMarkup + '/temp/**',
    folderMarkup + '/**'
];

function getFolderMarkup() {
    let folderMarkup = tars.flags.dev ? 'dev': 'builds';

    if(tars.flags.backend) {
        folderMarkup += '/static';
    }

    if(tars.flags.server) {
        folderMarkup = 'server';
    }

    return folderMarkup;
}

function getConfig() {
    if(tars.flags.frontend) {
        return tarsConfig.deploy.frontend;
    }else if(tars.flags.backend) {
        return tarsConfig.deploy.backend;
    }else if(tars.flags.local) {
        return tarsConfig.deploy.local;
    }else if(tars.flags.server) {
        return tarsConfig.deploy.server;
    }
}

function getPassword(path) {
    if(fs.existsSync(path)) {
        return fs.readFileSync(path, 'utf8');
    }else{
        return '';
    }
}

function getFtpConnection() {
    return ftp.create({
        host: config.host,
        user: config.user,
        password: getPassword(config.password),
        parallel: config.parallel
    });
}

module.exports = function () {

    return gulp.task('deploy', function (cb) {
        if(tars.flags.local) {
            del.sync([config.remoteFolder + '/static']);

            if(tars.flags.html) {
                return gulp.src([
                    '!' + folderMarkup + '/robots.txt',
                    '!' + folderMarkup + '/p.html',
                    folderMarkup + '/**'
                ])
                    .pipe(gulp.dest(config.remoteFolder ));
            }else{
                return gulp.src(folderMarkup + '/static/**')
                    .pipe(gulp.dest(config.remoteFolder + '/static'));
            }

        }else{
            let conn = getFtpConnection();

            return gulp.src(localFilesGlob, { base: folderMarkup + '/', buffer: false })
                .pipe( conn.newer( config.remoteFolder ) ) // only upload newer files
                .pipe( conn.dest( config.remoteFolder + '/' ) )
                .pipe(notify('Загрузка завершена!'));
        }
    });
};
