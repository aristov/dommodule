const { JSDOM } = require('jsdom')
global.sinon = require('sinon')
global.window = (new JSDOM).window

window.XMLSerializer = require('./serializer')
window.Element.prototype.closest = require('./closest')

require('../shim/jsdom.shim')
require('../spec/index.spec')
