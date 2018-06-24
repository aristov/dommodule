const { JSDOM } = require('jsdom')
global.sinon = require('sinon')
global.window = (new JSDOM).window

window.XMLSerializer = require('./serializer')
window.Element.prototype.closest = require('./closest')

/*
 * https://github.com/jsdom/jsdom/issues/1641
 */
if(Object.getPrototypeOf(window.Attr) !== window.Node) {
    Object.defineProperty(window.Attr.prototype, 'nodeType', {
        configurable : true,
        enumerable : true,
        get() {
            return window.Node.ATTRIBUTE_NODE
        }
    })
}

/*
 * https://github.com/jsdom/jsdom/issues/2273
 */
const { TextAssembler, CommentAssembler } = require('../lib/index')
TextAssembler.create = function() {
    return window.document.createTextNode(this.data)
}
CommentAssembler.create = function() {
    return window.document.createComment(this.data)
}

require('../spec/index.spec.js')
