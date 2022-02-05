// ===================================================
// Total.js start script
// https://www.totaljs.com
// ===================================================

const open = require('open');
const http = require('http')
const fs = require('fs')

const options = {};

var type = process.argv.indexOf('--release', 1) !== -1 || process.argv.indexOf('release', 1) !== -1 ? 'release' : 'debug';
require('total4/' + type)(options);


exports.install = function () {
    ROUTE('GET /index', 'index.html');
};


open('./index.html');
 