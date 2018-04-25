const { JSDOM } = require('jsdom')
const { window } = new JSDOM

global.window = window
global.sinon = require('sinon')
window.XMLSerializer = require('./serializer')
// require('dom4')
window.Element.prototype.closest = require('./closest')

require('../spec/index.spec.js')
