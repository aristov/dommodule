const { JSDOM } = require('jsdom')
const { window } = new JSDOM

global.window = window
global.sinon = require('sinon')
window.XMLSerializer = require('./serializer')

require('../dist/dist.spec.js')
