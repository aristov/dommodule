'use strict'

const localBrowserSet = {
    chrome : {
        base : 'Chrome',
        browserName : 'chrome',
        displayName : 'chrome'
    },
    firefox : {
        base : 'Firefox',
        browserName : 'firefox',
        displayName : 'firefox'
    },
    safari : {
        base : 'Safari',
        browserName : 'safari',
        displayName : 'safari'
    },
    opera : {
        base : 'Opera',
        browserName : 'opera',
        displayName : 'opera'
    },
}

const customLaunchers = localBrowserSet
const browsers = Object.keys(customLaunchers)

module.exports = function(config) {
    config.set({
        basePath : '',
        frameworks : ['mocha', 'sinon'],
        files : ['docs/build/build.spec.js'],
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
