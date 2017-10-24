const { JSDOM } = require('jsdom')
const jsdom = new JSDOM('', { contentType : 'application/xml' })
global.window = jsdom.window

const XMLSerializer = require('../test/serializer')
const serializer = new XMLSerializer

const dommodule = require('../dist/dist.jsdom.dommodule')

const {
    DocumentAssembler,
    attr, comment, doctype,
    element, fragment,
    instruction, text
} = dommodule

const $document = new DocumentAssembler({
    node : window.document,
    childNodes : [
        doctype('example'),
        fragment([
            instruction({
                target : 'xml-stylesheet',
                attrset : { href : './example.css' }
            }),
            element({
                localName : 'example',
                attributes : attr({
                    name : 'role',
                    value : 'application'
                }),
                childNodes : [
                    comment(new Date + ' version 1.0.0'),
                    text('Hello world!')
                ]
            })
        ])
    ]
})

console.log(serializer.serializeToString($document.node))
