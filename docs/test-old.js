import { element, ElementAssembler } from  '../lib/element'
import { document } from  '../lib/document'
import { doctype } from  '../lib/doctype'
import { fragment } from  '../lib/fragment'
import { text } from '../lib/text'
import { comment } from '../lib/comment'
import { cdata } from '../lib/cdata'
import { instruction } from '../lib/instruction'

class Anchor extends ElementAssembler {}

const XS_NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema'
const XS_NAMESPACE_PREFIX = 'xs'

class Attribute extends ElementAssembler {

    static get namespaceURI() {
        return XS_NAMESPACE_URI
    }

    static get prefix() {
        return XS_NAMESPACE_PREFIX
    }
}

function attribute(init = {}) {
    return new Attribute(init)
}

element({
    parentNode : window.document.documentElement,
    childNodes : [
        element({
            qualifiedName : 'a',
            childNodes : 'fuck'
        }),
        element('yeah'),
        fragment([
            new Anchor('test'),
            element({
                qualifiedName : 'a',
                namespaceURI : 'http://www.w3.org/1999/xhtml',
                href : '//github.com',
                childNodes : 'GitHub'
            }),
            element({
                qualifiedName : 'svg',
                namespaceURI : 'http://www.w3.org/2000/svg',
                childNodes : 'SVG'
            }),
            element({
                qualifiedName : 'xs:schema',
                namespaceURI : XS_NAMESPACE_URI
            }),
            new Attribute(window.document.createElement('aaaa')),
        ]),
        new Attribute({
            qualifiedName : 'xsl:template',
            namespaceURI : 'http://www.w3.org/1999/XSL/Transform'
        }),
        attribute(),
        text(),
        text('text'),
        comment(),
        comment('comment'),
        cdata(),
        cdata('cdata'),
        instruction(),
        instruction('instruction'),
        instruction({ target : 'instruction', data : 'processing' }),
    ]
})

console.log(doctype('html'))

const doc = document({
    namespaceURI : 'http://www.w3.org/2000/svg',
    qualifiedName : 'svg:svg',
    doctype : doctype({
        qualifiedName : 'svg:svg',
        publicId : '-//W3C//DTD SVG 1.1//EN',
        systemId : 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'
    }),
    documentElement : {
        id : 'root',
        attributes : { class : 'application' }
    }
})

console.log(doc.node)
console.dir(doc.node)

console.log(fragment(true))
