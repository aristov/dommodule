'use strict'

const path = require('path')

const localBrowserSet = {
    chrome : {
        base : 'Chrome',
        browserName : 'chrome',
        displayName : 'chrome'
    }
}

const customLaunchers = localBrowserSet
const browsers = Object.keys(customLaunchers)

module.exports = function(config) {
    config.set({
        basePath : '',
        frameworks : ['mocha', 'sinon'],
        files : ['dist/dist.spec.js'],
        exclude : [],
        reporters : ['mocha', 'coverage'],
        coverageReporter : {
            type : 'lcov',
            dir : 'dist/coverage/'
        },
        port : 9876,
        colors : true,
        logLevel : config.LOG_INFO,
        autoWatch : true,
        captureTimeout : 120000,
        customLaunchers,
        browsers,
        singleRun : true,
        concurrency : Infinity
    })
}
