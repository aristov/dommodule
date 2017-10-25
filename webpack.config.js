'use strict'

const path = require('path')
const { optimize : { UglifyJsPlugin } } = require('webpack')

const babelLoader = {
    test : /\.js$/,
    loader : 'babel-loader'
}
const distPath = path.join(__dirname, 'dist')

module.exports = [
    {
        entry : './lib/index.js',
        output : {
            path : distPath,
            filename : 'dist.dommodule.js',
            libraryTarget : 'commonjs2'
        },
        module : { loaders : [babelLoader] }
    },
    {
        entry : './lib/index.js',
        output : {
            path : distPath,
            filename : 'window.dommodule.js',
            library : 'dommodule',
            libraryTarget : 'window'
        },
        module : { loaders : [babelLoader] },
        plugins : [
            new UglifyJsPlugin({
                compress : { warnings : false },
                mangle : { keep_fnames : true },
                comments : false
            })
        ]
    },
    {
        entry : './spec/index.spec.js',
        output : {
            path : path.join(__dirname, 'build'),
            filename : 'build.spec.js'
        }
    }
]
