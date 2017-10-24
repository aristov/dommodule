const { JSDOM } = require('jsdom')
const { window } = new JSDOM
global.window = window
global.sinon = require('sinon')

const { domToHtml } = require('jsdom/lib/jsdom/browser/domtohtml')

window.XMLSerializer = class XMLSerializer {
    serializeToString(node) {
        if(node.nodeType === 9) return domToHtml([node])
        else {
            const { window : { document } } = new JSDOM('<document/>', {
                contentType : 'application/xml'
            })
            document.replaceChild(node, document.documentElement)
            return domToHtml([document])
        }
    }
}

require('../dist/dist.spec.js')
