'use strict'

const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const distPath = path.join(__dirname, 'dist')
const rules = []
const plugins = []

if(process.env.NODE_ENV === 'production') {
    rules.push({
        test : /\.js$/,
        use : { loader : 'babel-loader' }
    })
    plugins.push(new UglifyJsPlugin({
        uglifyOptions : {
            keep_fnames : true,
            keep_classnames : true,
            output : {
                comments : false
            }
        }
    }))
}

module.exports = [
    {
        mode : 'none',
        entry : './lib/index.js',
        output : {
            path : distPath,
            filename : 'dist.dommodule.js',
            libraryTarget : 'commonjs'
        },
        module : { rules }
    },
    {
        mode : 'none',
        entry : './lib/index.js',
        output : {
            path : distPath,
            filename : 'window.dommodule.js',
            library : 'dommodule',
            libraryTarget : 'window'
        },
        module : { rules },
        plugins
    },
    {
        mode : 'none',
        entry : './spec/index.spec.js',
        output : {
            path : path.join(__dirname, 'docs', 'build'),
            filename : 'build.spec.js'
        },
        module : { rules }
    }
]
