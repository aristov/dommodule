'use strict'

const path = require('path')

module.exports = {
    entry : {
        spec : ['./spec/index.spec.js'],
        // docs : ['./docs/index.js'],
        // element : ['./docs/element-test.js'],
        // attr : ['./docs/attr-test.js'],
        // index : ['./docs/index.js'],
        // dommodule : ['./lib'],
        // 'jsdom.dommodule' : ['./lib/index'],
        // 'window.dommodule' : ['./lib/window.dommodule'],
    },
    output : {
        path : path.join(__dirname, 'dist'),
        filename : 'dist.[name].js',
        // libraryTarget : 'commonjs2'
    },
    module : {
        loaders : [{ test : /\.js$/, loader : 'babel-loader' }]
    }
}
