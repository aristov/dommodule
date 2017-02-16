const path = require('path')

module.exports = {
    entry : {
        index : ['./docs/index.js'],
        dommodule : ['./lib'],
        'window.dommodule' : ['./lib/window.dommodule']
    },
    output: {
        path : path.join(__dirname, '/dist'),
        filename: 'dist.[name].js'
    }
}
