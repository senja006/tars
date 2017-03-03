'use strict';

module.exports = {

    /////////////////////
    // MUTABLE OPTIONS ////////////////////////////////
    // YOU CAN CHANGE THIS OPTIONS ALL THE TIME      //
    //                                               //
    // You need to restart builder to apply options. //
    ///////////////////////////////////////////////////

    /**
     * Postprocessors for TARS
     * @type {Array}
     * Example:
     *
     * postcss: [
     *     {
     *         name: 'postcss-short',
     *         options: {
     *             deny: ['text']
     *         }
     *     }
     * ]
     */
    postcss: [
        {
            name: 'postcss-flexbugs-fixes'
        }
    ],

    svg: {
        active: true,
        // symbols, sprite
        workflow: 'symbols',
        symbolsConfig: {
            // separate-file, separate-file-with-link, inject
            loadingType: 'separate-file-with-link',
            usePolyfillForExternalSymbols: true,
            pathToExternalSymbolsFile: 'static/img/sprite/'
        }
    },

    css: {
        // concat, manual
        workflow: 'concat'
    },

    js: {
        // concat, modular
        workflow: 'concat',

        // Only webpack is available right now
        bundler: 'webpack',

        /**
         * Use linting of js-files
         * @type {Boolean}
         */
        lint: false,

        /**
         * Use babel for ES6(ES7-ESNext) syntax support
         * @type {Boolean}
         */
        useBabel: true,

        /**
         * Remove console.log and debugger from js code in release mode
         * @type {Boolean}
         */
        removeConsoleLog: true,

        // Special config for webpack
        webpack: {
            useHMR: false,

            /**
             * Automatically loaded modules.
             * Module (value) is loaded when the identifier (key) is used as free variable in a module.
             * The identifier is filled with the exports of the loaded module.
             * Example: {$: "jquery"} or {React: 'react'}
             * @type {Object}
             */
            providePlugin: {}
        },

        /**
         * Path-strings to js-files, which have to be included before modules' js-files
         * Example: ['./markup/controller/** /*.js']
         * @type {Array}
         */
        jsPathsToConcatBeforeModulesJs: ['./markup/**/*.concat-before.js'],

        /**
         * Lint additional js before modules
         * @type {Boolean}
         */
        lintJsCodeBeforeModules: false,

        /**
         * Path-strings to js-files, which have to be included before modules' js-files
         * @type {Array}
         */
        jsPathsToConcatAfterModulesJs: ['./markup/static/js/initYaModules.js'],

        /**
         * Lint additional js after modules
         * @type {Boolean}
         */
        lintJsCodeAfterModules: false
    },

    /**
     * Write sourcemaps
     * @type {Object}
     *
     * active – is sourcemaps active
     * inline – use inline sourcemaps or in separate file
     */
    sourcemaps: {
        js: {
            active: true,
            inline: false
        },
        css: {
            active: true,
            inline: true
        }
    },

    /**
     * Config for Notify module
     * @type {Object}
     */
    notifyConfig: {

        /**
         * Do you need to use notify?
         * @type {Boolean}
         */
        useNotify: false,

        /**
         * Title for notifier
         * @type {String}
         */
        title: 'TARS notification',

        /**
         * Sounds notifactions
         * String (name of system sound) or undefined, if you don't need to hear any sounds
         * @type {Object}
         */
        sounds: {

            /**
             * Sound after successfull finishing of task
             * @type {String, undefined}
             * For example 'Glass' in OS X
             */
            onSuccess: undefined,

            /**
             * Sound after failed finishing of task
             * @type {String, undefined}
             * For example 'Glass' in OS X
             */
            onError: undefined
        },

        /**
         * Label for timestamp of task finishing time
         * @type {String}
         */
        taskFinishedText: 'Task finished at: '
    },

    /**
     * Minify result html in build version
     * If is set to false, compiled html will be prettified
     * @type {Boolean}
     */
    minifyHtml: true,

    /**
     * TARS will generate relative path from current page
     * to static files in case of true value
     * @type {Boolean}
     */
    generateStaticPath: true,

    /**
     * Path to build version of project
     * Could be like '../../../build' or absolute path
     * @type {String}
     */
    buildPath: './builds/',

    /**
     * Use build versioning
     * Build version is a date ot building
     * @type {Boolean}
     */
    useBuildVersioning: false,

    /**
     * Use archiver for your build
     * @type {Boolean}
     */
    useArchiver: false,

    /**
     * Set ulimit. Topical for Linux-family OS and OSX.
     * @type {Number}
     */
    ulimit: 4096,

    //////////////////////////////////////////////
    //////////////////////////////////////////////

    ////////////////////////////////////////////////////////
    // YOU CAN CHANGE THIS OPTIONS AND USE REINIT         //
    //                                                    //
    // Options for technologies, which you'd like to use. //
    ////////////////////////////////////////////////////////

    /**
     * Templater
     * Available 'pug', 'jade' and 'handlebars'
     * @type {String}
     */
    templater: 'handlebars',

    /**
     * Css-preprocessor
     * Available 'scss', 'less' or 'stylus'
     * .sass extension is supported if cssPreprocessor is 'scss'
     * @type {String}
     */
    cssPreprocessor: 'scss',

    /**
     * What kind of size of images are you going to use.
     * 96 — 1 dppx (regular)
     * 192 — 2 dppx (retina)
     * 288 — 3 dppx (nexus 5, for example)
     * 384 - 4 dppx (nexus 6, for example)
     * Example if using for all displays: usePpi: [96, 192, 288, 384]
     * You can change with options not only on init or reinit,
     * but at with time you have to create new directories
     * and delete unused.
     * @type {Array}
     */
    useImagesForDisplayWithDpi: [96, 192],

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////

    ////////////////////////////////////////////////////////
    // You have to change with options after manually      //
    // renaming static and img folder                     //
    //                                                    //
    // Do not rename these dirs before reinit             //
    ////////////////////////////////////////////////////////

    /**
     * File structure settings
     * @type {Object}
     */
    fs: {

        /**
         * Name of folder with static files, such *.css, *.js and so on
         * 'static' by default
         * @type {String}
         */
        staticFolderName: 'static',

        /**
         * Name of folder with images
         * 'img' by default
         * @type {String}
         */
        imagesFolderName: 'img',

        /**
         * Name of folder with modules
         * 'modules' by default
         * @type {String}
         */
        componentsFolderName: 'components'
    },

    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////

    /**
     * Настройки деплоя проекта
     */
    deploy: {
        frontend: { // настройки для фронтенда
            host:     's19.webhost1.ru', // host ftp
            user:     'senja006', // login
            password: 'pass-ftp-front.txt', // в этом файле хранится пароль
            parallel: 10, // количество одовременных загрузок
            remoteFolder: '.yarkevich.ru',
        },
        backend: { // настройки для бэкенда
            host:     's19.webhost1.ru', // host ftp
            user:     'senja006', // login
            password: 'pass-ftp-front.txt', // в этом файле хранится пароль
            parallel: 10, // количество одовременных загрузок
            remoteFolder: '.yarkevich.ru/static/'
        },
        local: {
            remoteFolder: 'server' // путь до папки static (без названия папки static)
        },
        server: {
            host:     's19.webhost1.ru', // host ftp
            user:     'senja006', // login
            password: 'pass-ftp-front.txt', // в этом файле хранится пароль
            parallel: 10, // количество одовременных загрузок
            remoteFolder: '.yarkevich.ru',
        }
    }
};
