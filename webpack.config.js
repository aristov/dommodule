const path = require('path')

module.exports = {
    entry : {
        index : ['./docs/attr-test.js'],
        dommodule : ['./lib'],
        // 'jsdom.dommodule' : ['./lib/index'],
        // 'window.dommodule' : ['./lib/window.dommodule']
    },
    output : {
        path : path.join(__dirname, 'dist'),
        filename : 'dist.[name].js',
        // libraryTarget : 'commonjs2'
    }
}
