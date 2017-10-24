'use strict'

const path = require('path')

module.exports = {
    entry : {
        spec : ['./spec/index.spec.js'],
        document : ['./test/document-test.js'],
        // docs : ['./test/index.js'],
        // element : ['./test/element-test.js'],
        // attr : ['./test/attr-test.js'],
        // index : ['./test/index.js'],
        // dommodule : ['./lib'],
        'jsdom.dommodule' : ['./lib/index'],
    },
    output : {
        path : path.join(__dirname, 'dist'),
        filename : 'dist.[name].js',
        // libraryTarget : 'commonjs2'
    },
    module : process.env.NODE_ENV === 'test'? {
        loaders : [{
            test : /\.js$/,
            loader : 'babel-loader'
        }]
    } : undefined
}
