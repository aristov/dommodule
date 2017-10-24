const jsdom = require('jsdom')
const { JSDOM } = jsdom
const document = new JSDOM('', { contentType : 'application/xml' })
global.window = document.window

const xmlserializer = require('xmlserializer')

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

console.log(xmlserializer.serializeToString($document.node))
