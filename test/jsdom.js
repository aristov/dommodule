const { JSDOM } = require('jsdom')
const { XMLSerializer } = require('xmldom')
const jsdom = new JSDOM('', { contentType : 'application/xml' })
global.window = jsdom.window

const dommodule = require('../dist/dist.jsdom.dommodule')

const {
    DocumentAssembler,
    attr,
    cdata,
    comment,
    doctype,
    element,
    fragment,
    instruction,
    text
} = dommodule

const testDoc = new DocumentAssembler({ node : window.document }, {
    documentElement : element({
        qualifiedName : 'root',
        attributes : [attr({ name : 'testattr', value : 'testvalue' })],
        children : [
            cdata('CDATA section test'),
            comment('Comment test'),
            fragment([
                instruction({ target : 'PI-test', data : 'PI-data-test' }),
                text('Text test')
            ])
        ]
    })
})

const serializer = new XMLSerializer

console.log(jsdom.serialize())
// console.log(serializer.serializeToString(testDoc.node))
// console.log(testDoc.documentElement.node.outerHTML)
