'use strict';

const Handlebars = tars.packages.handlebars;
// const helpers = require('handlebars-helpers')();

const helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});

/**
 * You can add your own helpers to handlebarsHelpers Object
 * All helpers from that object will be available in templates
 * @type {Object}
 */
// const handlebarsHelpers = {
//
//     /**
//      * This is an example of handlebars-helper
//      * This helper gets string and returns it
//      * @param  {String} str Source string
//      * @return {String}     Result string
//      */
//     exampleHelper: function (str) {
//         return str;
//     },
//
//     random: function() {
//         return Math.random().toString(36).substring(7);
//     },
// };
//
// module.exports = handlebarsHelpers;
