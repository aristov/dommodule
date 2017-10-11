const { JSDOM } = require('jsdom')
const jsdom = new JSDOM

global.window = jsdom.window

const dommodule = require('../dist/dist.jsdom.dommodule')

const {
    DocumentAssembler,
    element
} = dommodule

new DocumentAssembler({ node : window.document }, {
    documentElement : {
        children : [
            element('test'),
            element({
                qualifiedName : 'test',
                attrset : { attrname : 'attrvalue' },
                children : 'attrtest'
            })
        ]
    }
})

console.log(jsdom.serialize())
